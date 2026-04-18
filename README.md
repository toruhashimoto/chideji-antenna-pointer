# 地デジアンテナポインター

日本の地上デジタル放送の送信所方向を計算して、自宅アンテナの向きを決めるためのPWA（Progressive Web App）。iPhone SafariからHome画面に追加することでネイティブアプリのように使えます。

## 機能

- 📍 GPSで現在地を取得
- 🧭 iPhoneの方位センサーで向きを検出
- 📡 全国47都道府県の主要送信所(親局)の座標を内蔵
- 🎯 最寄り送信所の自動選択 or 手動選択
- 📏 方位角と距離を計算・表示
- 📱 オフライン動作対応（Service Worker）

## ローカルで動作確認

PWAとして動かすにはHTTPSまたは`localhost`が必要（Geolocation・DeviceOrientation APIの制約）。

```bash
# Python (同梱)
cd "D:/Claude/Tools/地デジアンテナポインター"
python -m http.server 8000

# またはNode.js
npx serve -l 8000
```

ブラウザで <http://localhost:8000> にアクセス。PC上でも基本動作は確認できますが、方位センサーはモバイル必須です。

## iPhoneで使う

### 方法1: PC上で開発サーバを立てて同一Wi-Fi経由で接続

1. PCとiPhoneを同じWi-Fiに接続
2. PCのIPアドレス確認: `ipconfig` (Windows)
3. `python -m http.server 8000 --bind 0.0.0.0`
4. iPhoneのSafariで `http://<PCのIP>:8000` を開く

※ ただし**HTTPS でないと iOS の DeviceOrientation 許可ダイアログが出ない**ため、方位センサーを使うには次の方法を推奨。

### 方法2: HTTPS でデプロイ（推奨）

無料ホスティング例:

- **GitHub Pages**: リポジトリ作成→push→Settings→Pages→デプロイ
- **Netlify Drop**: <https://app.netlify.com/drop> にフォルダをドラッグ&ドロップ
- **Vercel**: `vercel` CLI で一発デプロイ
- **Cloudflare Pages**: Dashboardから接続

### iPhoneのHome画面に追加

1. HTTPSのURLをSafariで開く
2. 共有ボタン → 「ホーム画面に追加」
3. アプリアイコンが追加される

## 使い方

1. アプリ起動後「**開始する**」をタップ
2. 位置情報の許可ダイアログで **許可** を選択
3. 方位センサーの許可ダイアログで **許可** を選択
4. iPhoneを**水平に持ち**、8の字に動かしてコンパスを校正
5. 矢印が指す方向へアンテナを向ける

### 注意事項

- 送信所座標は**概算値**です。地域によっては中継局の方が受信しやすい場合があります
- 方位精度は±5〜10度程度。指向性UHFアンテナのメインローブは通常30〜60度あるので実用上は十分
- 金属製の柵や屋内ではコンパスが狂いやすいので**屋外で使用推奨**
- アンテナ設置は**高所(屋根上)** が基本。建物や山が障害物になる場合、中継局への切り替えを検討

## ファイル構成

```
地デジアンテナポインター/
├── index.html          # メインHTML
├── manifest.json       # PWAマニフェスト
├── sw.js               # Service Worker (オフライン対応)
├── css/
│   └── style.css       # スタイル
├── js/
│   ├── app.js          # メインロジック
│   └── transmitters.js # 送信所データ
└── icons/              # アプリアイコン
    ├── icon.svg
    ├── icon-180.png    # iOS用
    ├── icon-192.png    # PWA用
    └── icon-512.png    # PWA用(maskable)
```

## ネイティブiOSアプリ化したい場合

SwiftUIに移植する場合の主な対応点:

- **位置情報**: `CLLocationManager`
- **方位**: `CLLocationManager.headingOrientation` で `newHeading.trueHeading`
- **計算ロジック**: `bearingBetween()` / `distanceBetween()` をそのままSwiftに移植可能

AppStore配信にはMacとApple Developer Program(年$99)が必要。個人利用なら PWA で十分です。

## 技術的な補足

### 方位角計算

地球を球とみなした大圏コース上の初期方位:

```
θ = atan2( sin(Δλ)·cos(φ₂),  cos(φ₁)·sin(φ₂) − sin(φ₁)·cos(φ₂)·cos(Δλ) )
```

### 距離計算

Haversine式 (地球半径 R = 6371km):

```
a = sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)
d = 2R·atan2(√a, √(1−a))
```

### iOSコンパス

- `DeviceOrientationEvent.webkitCompassHeading` が**真北基準**の方位(0-360度)を返す
- iOS 13以降は `DeviceOrientationEvent.requestPermission()` のユーザージェスチャが必須
- 画面の向き（縦/横）に応じた補正も加算
