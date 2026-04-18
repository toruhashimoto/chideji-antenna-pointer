// 日本の地上デジタル放送 主要送信所（親局）データ
// 座標は概算値。各都道府県の主要な親局を収録
// 指向性アンテナのメインローブは通常30〜60度なので、数度の誤差は許容範囲

const TRANSMITTERS = [
  // 北海道
  { name: "札幌 手稲山", region: "北海道", lat: 43.0875, lon: 141.2436, elevation: 1023, power: "2.5kW" },
  { name: "函館 横津岳", region: "北海道", lat: 41.7906, lon: 140.8272, elevation: 1167, power: "1kW" },
  { name: "旭川 嵐山", region: "北海道", lat: 43.8544, lon: 142.3100, elevation: 253, power: "1kW" },
  { name: "釧路 昆布森", region: "北海道", lat: 43.0506, lon: 144.6061, elevation: 150, power: "1kW" },
  { name: "室蘭 測量山", region: "北海道", lat: 42.3283, lon: 140.9650, elevation: 200, power: "100W" },
  { name: "帯広 八木山", region: "北海道", lat: 42.8900, lon: 143.2094, elevation: 250, power: "1kW" },
  { name: "北見 上仁頃", region: "北海道", lat: 43.7953, lon: 143.9036, elevation: 570, power: "1kW" },

  // 東北
  { name: "青森 梵珠山", region: "東北", lat: 40.7631, lon: 140.6228, elevation: 468, power: "1kW" },
  { name: "盛岡 新山", region: "東北", lat: 39.7125, lon: 141.1389, elevation: 481, power: "1kW" },
  { name: "秋田 大森山", region: "東北", lat: 39.6756, lon: 140.0333, elevation: 123, power: "1kW" },
  { name: "山形 西蔵王", region: "東北", lat: 38.2111, lon: 140.3736, elevation: 680, power: "1kW" },
  { name: "仙台 大年寺山", region: "東北", lat: 38.2394, lon: 140.8636, elevation: 120, power: "3kW" },
  { name: "福島 信夫山", region: "東北", lat: 37.7706, lon: 140.4681, elevation: 275, power: "1kW" },

  // 関東(東京スカイツリーが主力)
  { name: "東京スカイツリー", region: "関東", lat: 35.7101, lon: 139.8107, elevation: 634, power: "10kW" },
  { name: "東京タワー(予備)", region: "関東", lat: 35.6586, lon: 139.7454, elevation: 333, power: "3kW" },
  { name: "水戸 朝房山", region: "関東", lat: 36.4339, lon: 140.3492, elevation: 200, power: "500W" },
  { name: "宇都宮 本山", region: "関東", lat: 36.7386, lon: 139.8822, elevation: 562, power: "500W" },
  { name: "前橋 十二ヶ岳", region: "関東", lat: 36.5678, lon: 139.0053, elevation: 1200, power: "500W" },

  // 中部
  { name: "新潟 弥彦山", region: "中部", lat: 37.7064, lon: 138.8306, elevation: 634, power: "3kW" },
  { name: "富山 呉羽山", region: "中部", lat: 36.6858, lon: 137.1989, elevation: 145, power: "500W" },
  { name: "金沢 医王山", region: "中部", lat: 36.5683, lon: 136.8275, elevation: 939, power: "1kW" },
  { name: "福井 足羽山", region: "中部", lat: 36.0547, lon: 136.2164, elevation: 116, power: "500W" },
  { name: "甲府 坊ヶ峰", region: "中部", lat: 35.7067, lon: 138.5728, elevation: 700, power: "500W" },
  { name: "長野 美ヶ原", region: "中部", lat: 36.2358, lon: 138.1053, elevation: 2034, power: "1kW" },
  { name: "岐阜 金華山", region: "中部", lat: 35.4361, lon: 136.7819, elevation: 329, power: "100W" },
  { name: "静岡 日本平", region: "中部", lat: 34.9717, lon: 138.4661, elevation: 307, power: "1kW" },
  { name: "名古屋 瀬戸デジタルタワー", region: "中部", lat: 35.2311, lon: 137.0956, elevation: 245, power: "3kW" },

  // 関西
  { name: "大阪 生駒山", region: "関西", lat: 34.6783, lon: 135.6783, elevation: 642, power: "3kW" },
  { name: "京都 比叡山", region: "関西", lat: 35.0728, lon: 135.8278, elevation: 848, power: "500W" },
  { name: "神戸 摩耶山", region: "関西", lat: 34.7211, lon: 135.2161, elevation: 702, power: "1kW" },
  { name: "和歌山 甲山", region: "関西", lat: 34.1833, lon: 135.3167, elevation: 152, power: "100W" },
  { name: "大津 音羽山", region: "関西", lat: 34.9806, lon: 135.8617, elevation: 593, power: "100W" },

  // 中国
  { name: "鳥取 霊石山", region: "中国", lat: 35.4406, lon: 134.3381, elevation: 334, power: "500W" },
  { name: "松江 枕木山", region: "中国", lat: 35.5128, lon: 133.0500, elevation: 453, power: "500W" },
  { name: "岡山 金甲山", region: "中国", lat: 34.5061, lon: 133.9472, elevation: 403, power: "1kW" },
  { name: "広島 絵下山", region: "中国", lat: 34.3136, lon: 132.5447, elevation: 593, power: "1kW" },
  { name: "山口 大平山", region: "中国", lat: 34.0111, lon: 131.5889, elevation: 631, power: "500W" },

  // 四国
  { name: "徳島 眉山", region: "四国", lat: 34.0608, lon: 134.5444, elevation: 290, power: "500W" },
  { name: "高松 前田山", region: "四国", lat: 34.2683, lon: 134.0794, elevation: 300, power: "1kW" },
  { name: "松山 行道山", region: "四国", lat: 33.8500, lon: 132.7833, elevation: 619, power: "500W" },
  { name: "高知 五台山", region: "四国", lat: 33.5528, lon: 133.5878, elevation: 146, power: "500W" },

  // 九州
  { name: "福岡 鴻巣山", region: "九州", lat: 33.5575, lon: 130.4089, elevation: 100, power: "1kW" },
  { name: "北九州 皿倉山", region: "九州", lat: 33.8478, lon: 130.7894, elevation: 622, power: "1kW" },
  { name: "佐賀 九千部山", region: "九州", lat: 33.3739, lon: 130.4097, elevation: 848, power: "500W" },
  { name: "長崎 稲佐山", region: "九州", lat: 32.7403, lon: 129.8392, elevation: 333, power: "500W" },
  { name: "大分 十文字原", region: "九州", lat: 33.3158, lon: 131.4597, elevation: 400, power: "500W" },
  { name: "熊本 金峰山", region: "九州", lat: 32.7775, lon: 130.6161, elevation: 665, power: "1kW" },
  { name: "宮崎 双石山", region: "九州", lat: 31.8750, lon: 131.3931, elevation: 499, power: "500W" },
  { name: "鹿児島 紫尾山", region: "九州", lat: 31.9869, lon: 130.4008, elevation: 1067, power: "500W" },

  // 沖縄
  { name: "那覇 豊見城", region: "沖縄", lat: 26.1711, lon: 127.6875, elevation: 80, power: "500W" },
];
