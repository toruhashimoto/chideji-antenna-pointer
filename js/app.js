// 地デジアンテナポインター メインアプリ

const state = {
  userLat: null,
  userLon: null,
  userAccuracy: null,
  selectedTransmitter: null,
  autoSelect: true,
  compassHeading: 0,
  watchId: null,
};

const el = {
  permissionSection: document.getElementById("permission-section"),
  startBtn: document.getElementById("start-btn"),
  permissionStatus: document.getElementById("permission-status"),
  mainUi: document.getElementById("main-ui"),
  compassRing: document.getElementById("compass-ring"),
  arrowContainer: document.getElementById("arrow-container"),
  transmitterSelect: document.getElementById("transmitter-select"),
  refreshLocation: document.getElementById("refresh-location"),
  currentTransmitter: document.getElementById("current-transmitter"),
  bearing: document.getElementById("bearing"),
  distance: document.getElementById("distance"),
  heading: document.getElementById("heading"),
  userLat: document.getElementById("user-lat"),
  userLon: document.getElementById("user-lon"),
  userAccuracy: document.getElementById("user-accuracy"),
};

// ---------- 幾何計算 ----------

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

// 方位角計算 (2点間の初期方位、真北基準、0-360度)
function bearingBetween(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

// 距離計算 (Haversine、km)
function distanceBetween(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 方位を「北北東」等の文字列に
function bearingToCardinal(b) {
  const dirs = ["北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東",
                "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西"];
  return dirs[Math.round(b / 22.5) % 16];
}

// ---------- 送信所選択 ----------

function populateTransmitterList() {
  const regions = {};
  TRANSMITTERS.forEach((t, i) => {
    if (!regions[t.region]) regions[t.region] = [];
    regions[t.region].push({ ...t, index: i });
  });
  Object.keys(regions).forEach((region) => {
    const group = document.createElement("optgroup");
    group.label = region;
    regions[region].forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.index;
      opt.textContent = t.name;
      group.appendChild(opt);
    });
    el.transmitterSelect.appendChild(group);
  });
}

function findNearestTransmitter(lat, lon) {
  let min = Infinity;
  let nearest = null;
  TRANSMITTERS.forEach((t) => {
    const d = distanceBetween(lat, lon, t.lat, t.lon);
    if (d < min) {
      min = d;
      nearest = t;
    }
  });
  return nearest;
}

function updateTransmitterDisplay() {
  if (state.userLat == null) return;
  let t;
  if (state.autoSelect) {
    t = findNearestTransmitter(state.userLat, state.userLon);
  } else {
    t = state.selectedTransmitter;
  }
  if (!t) return;
  state.selectedTransmitter = t;

  const bearing = bearingBetween(state.userLat, state.userLon, t.lat, t.lon);
  const distance = distanceBetween(state.userLat, state.userLon, t.lat, t.lon);

  el.currentTransmitter.textContent = t.name;
  el.bearing.textContent = `${bearing.toFixed(1)}° (${bearingToCardinal(bearing)})`;
  el.distance.textContent = `${distance.toFixed(1)} km`;

  state.targetBearing = bearing;
  updateArrow();
}

function updateArrow() {
  if (state.targetBearing == null) return;
  const rotation = state.targetBearing - state.compassHeading;
  el.arrowContainer.style.transform = `rotate(${rotation}deg)`;
  el.compassRing.style.transform = `rotate(${-state.compassHeading}deg)`;
  el.heading.textContent = `${state.compassHeading.toFixed(0)}°`;
}

// ---------- 位置情報 ----------

function startGeolocation() {
  if (!("geolocation" in navigator)) {
    setStatus("位置情報APIが利用できません", "error");
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    // まず単発取得で初期位置
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePosition(pos);
        // 継続監視
        if (state.watchId != null) navigator.geolocation.clearWatch(state.watchId);
        state.watchId = navigator.geolocation.watchPosition(
          handlePosition,
          (err) => console.warn("位置情報エラー:", err),
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
        resolve();
      },
      (err) => {
        setStatus(`位置情報取得失敗: ${err.message}`, "error");
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}

function handlePosition(pos) {
  state.userLat = pos.coords.latitude;
  state.userLon = pos.coords.longitude;
  state.userAccuracy = pos.coords.accuracy;
  el.userLat.textContent = state.userLat.toFixed(6);
  el.userLon.textContent = state.userLon.toFixed(6);
  el.userAccuracy.textContent = `±${state.userAccuracy.toFixed(0)}m`;
  updateTransmitterDisplay();
}

// ---------- 方位センサー ----------

function startOrientation() {
  return new Promise((resolve, reject) => {
    const attach = () => {
      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      resolve();
    };

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+
      DeviceOrientationEvent.requestPermission()
        .then((res) => {
          if (res === "granted") {
            attach();
          } else {
            setStatus("方位センサーの許可が得られませんでした", "error");
            reject();
          }
        })
        .catch((err) => {
          setStatus(`方位センサーエラー: ${err.message}`, "error");
          reject(err);
        });
    } else {
      attach();
    }
  });
}

function handleOrientation(e) {
  let heading;
  // iOS: webkitCompassHeading (真北基準、時計回り 0-360)
  if (typeof e.webkitCompassHeading === "number") {
    heading = e.webkitCompassHeading;
  } else if (e.absolute && typeof e.alpha === "number") {
    // Android (absolute): alpha は 反時計回りなので 360 - alpha
    heading = (360 - e.alpha) % 360;
  } else if (typeof e.alpha === "number") {
    heading = (360 - e.alpha) % 360;
  } else {
    return;
  }

  // 画面の向きに応じて補正
  const screenAngle =
    (screen.orientation && screen.orientation.angle) ||
    window.orientation ||
    0;
  heading = (heading + screenAngle) % 360;

  state.compassHeading = heading;
  updateArrow();
}

// ---------- UI ----------

function setStatus(msg, cls) {
  el.permissionStatus.textContent = msg;
  el.permissionStatus.className = "status-text" + (cls ? " " + cls : "");
}

async function start() {
  el.startBtn.disabled = true;
  el.startBtn.textContent = "接続中...";
  setStatus("位置情報を取得中...");

  try {
    await startGeolocation();
    setStatus("方位センサーに接続中...");
    await startOrientation();
    setStatus("接続完了", "success");

    el.permissionSection.hidden = true;
    el.mainUi.hidden = false;
  } catch (err) {
    el.startBtn.disabled = false;
    el.startBtn.textContent = "再試行";
    console.error(err);
  }
}

function setupEvents() {
  el.startBtn.addEventListener("click", start);

  el.transmitterSelect.addEventListener("change", (e) => {
    const v = e.target.value;
    if (v === "auto") {
      state.autoSelect = true;
    } else {
      state.autoSelect = false;
      state.selectedTransmitter = TRANSMITTERS[parseInt(v, 10)];
    }
    updateTransmitterDisplay();
  });

  el.refreshLocation.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(handlePosition, (err) =>
      console.warn(err)
    );
  });

  // PWA Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn(e));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateTransmitterList();
  setupEvents();
});
