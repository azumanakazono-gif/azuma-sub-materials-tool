export const INITIAL_PROJECTS = [
  {
    id: '273', status: '完了', name: '中村様邸（中村義子様娘）PV導入', client: '中村義子様', category: '住宅用PV', sales: '内田',
    revenue: 483800, cost: 173930, budgetDiff: -84890, profitRateEst: 65.0, profitRateAct: 64.1,
    items: [
      { id: 'i273-01', date: '2025-03-10', vendor: '長州産業', name: 'CS-340B81 太陽光モジュール 340W', qty: 12, unit: 8500, owner: '内田' },
      { id: 'i273-02', date: '2025-03-10', vendor: '長州産業', name: 'パワーコンディショナ CS-P55G4D', qty: 1, unit: 38000, owner: '内田' },
      { id: 'i273-03', date: '2025-03-15', vendor: 'カナメ', name: '架台セット（陸屋根用）12枚分', qty: 1, unit: 24000, owner: '内田' },
      { id: 'i273-04', date: '2025-03-18', vendor: '九電テクノ', name: 'PV接続箱 4回路', qty: 1, unit: 6800, owner: '内田' },
      { id: 'i273-05', date: '2025-03-20', vendor: '九電テクノ', name: 'CVケーブル 3.5sq 2C（PV用）', qty: 40, unit: 185, owner: '内田' },
    ],
  },
  {
    id: '277', status: '完了', name: '牛島電機 屋根⑤⑥ リパワリング', client: '牛島弘人様', category: 'リパワリング', sales: '平井・内田',
    revenue: 2386436, cost: 324910, budgetDiff: 23090, profitRateEst: 85.0, profitRateAct: 86.4,
    items: [
      { id: 'i277-01', date: '2025-02-05', vendor: 'ネクストエナジー', name: 'NER120M345C-MBH モジュール 345W', qty: 60, unit: 2800, owner: '平井' },
      { id: 'i277-02', date: '2025-02-05', vendor: 'ネクストエナジー', name: 'PCS NX3098-HNS 9.8kW', qty: 2, unit: 42000, owner: '平井' },
      { id: 'i277-03', date: '2025-02-10', vendor: 'カナメ', name: '折板屋根架台セット 60枚分', qty: 1, unit: 48000, owner: '内田' },
      { id: 'i277-04', date: '2025-02-15', vendor: '九電テクノ', name: 'CVケーブル 8sq 2C', qty: 120, unit: 380, owner: '内田' },
      { id: 'i277-05', date: '2025-02-18', vendor: '九電テクノ', name: 'PV集電箱 6回路', qty: 2, unit: 12500, owner: '内田' },
      { id: 'i277-06', date: '2025-02-20', vendor: '九電テクノ', name: '接地棒セット（D種接地）', qty: 4, unit: 3200, owner: '内田' },
    ],
  },
  {
    id: '284', status: '完了', name: '中村敏弘様邸 PCS2台交換工事', client: '中村敏弘様', category: '戸建てPCS交換', sales: '三宅',
    revenue: 172000, cost: 67470, budgetDiff: -47470, profitRateEst: 70.0, profitRateAct: 60.8,
    items: [
      { id: 'i284-01', date: '2025-04-05', vendor: 'オムロン', name: 'KPV-A55-J4 PCS 5.5kW', qty: 2, unit: 28000, owner: '三宅' },
      { id: 'i284-02', date: '2025-04-08', vendor: '九電テクノ', name: 'PV-CN ケーブル MC4コネクタ付 5m', qty: 4, unit: 1850, owner: '三宅' },
      { id: 'i284-03', date: '2025-04-08', vendor: '九電テクノ', name: '配線ダクト 40×30 2m', qty: 3, unit: 1290, owner: '三宅' },
    ],
  },
  {
    id: '286', status: '進行中', name: '合同会社Epower（アサヒ管材）城島発電所③ リプレイス', client: 'アサヒ管材株式会社', category: 'リプレイス', sales: '内田',
    revenue: 423300, cost: 67100, budgetDiff: 32900, profitRateEst: 80.0, profitRateAct: 84.1,
    items: [
      { id: 'i286-01', date: '2025-05-12', vendor: 'ネクストエナジー', name: 'NER120M375D-MBH モジュール 375W', qty: 8, unit: 3200, owner: '内田' },
      { id: 'i286-02', date: '2025-05-15', vendor: 'カナメ', name: '地上架台 8枚用セット', qty: 1, unit: 22000, owner: '内田' },
      { id: 'i286-03', date: '2025-05-18', vendor: '九電テクノ', name: 'CVT 14sq 3C ケーブル', qty: 30, unit: 620, owner: '内田' },
    ],
  },
  {
    id: '292', status: '完了', name: '牟田建設様 三橋アパート 鳩除け＋屋根洗浄', client: '牟田建設', category: 'その他', sales: '内田',
    revenue: 241819, cost: 95261, budgetDiff: 25539, profitRateEst: 55.0, profitRateAct: 60.6,
    items: [
      { id: 'i292-01', date: '2025-03-25', vendor: 'バードテック', name: '鳩除けスパイク BPS-300', qty: 40, unit: 850, owner: '内田' },
      { id: 'i292-02', date: '2025-03-25', vendor: 'バードテック', name: '鳩除けネット 3m×10m', qty: 2, unit: 12000, owner: '内田' },
      { id: 'i292-03', date: '2025-03-28', vendor: 'クリーンテクノ', name: '屋根高圧洗浄 作業一式', qty: 1, unit: 35000, owner: '内田' },
      { id: 'i292-04', date: '2025-03-28', vendor: 'クリーンテクノ', name: '防藻コーティング材', qty: 3, unit: 4487, owner: '内田' },
    ],
  },
  {
    id: '300', status: '完了', name: '佐藤 寛将 様邸 既築10kW以下余剰FIT', client: '株式会社 彩', category: '住宅用PV', sales: '三宅',
    revenue: 353000, cost: 8500, budgetDiff: 61916, profitRateEst: 75.0, profitRateAct: 97.6,
    items: [
      { id: 'i300-01', date: '2025-04-20', vendor: '九電テクノ', name: 'FIT申請代行手数料', qty: 1, unit: 5000, owner: '三宅' },
      { id: 'i300-02', date: '2025-04-22', vendor: '九電テクノ', name: 'CTセンサー 75A', qty: 1, unit: 3500, owner: '三宅' },
    ],
  },
  {
    id: '327', status: '完了', name: 'ユニバーサル測器様 PV(セラフィム+新電元) 東区画リパワリング', client: 'ユニバーサル測器', category: 'リパワリング', sales: '内田',
    revenue: 869500, cost: 29696, budgetDiff: 119304, profitRateEst: 80.0, profitRateAct: 96.6,
    items: [
      { id: 'i327-01', date: '2025-01-20', vendor: 'セラフィム', name: 'SRP-400-BMA モジュール 400W', qty: 20, unit: 5200, owner: '内田' },
      { id: 'i327-02', date: '2025-01-20', vendor: '新電元', name: 'PVS010T200 PCS 10kW', qty: 1, unit: 58000, owner: '内田' },
      { id: 'i327-03', date: '2025-01-25', vendor: 'カナメ', name: '折板屋根架台 20枚分', qty: 1, unit: 18000, owner: '内田' },
      { id: 'i327-04', date: '2025-01-28', vendor: '九電テクノ', name: 'CVケーブル 5.5sq 2C', qty: 80, unit: 245, owner: '内田' },
      { id: 'i327-05', date: '2025-02-01', vendor: '九電テクノ', name: '端子台 600V 30A', qty: 6, unit: 1580, owner: '内田' },
    ],
  },
  {
    id: '31001', status: '完了', name: '丸林 義輝 様邸 10kW以下余剰FIT 八女市補助金活用', client: '丸林 義輝様', category: '住宅用PV', sales: '三宅',
    revenue: 591000, cost: 197728, budgetDiff: -20648, profitRateEst: 70.0, profitRateAct: 66.5,
    items: [
      { id: 'i31001-01', date: '2025-05-05', vendor: '長州産業', name: 'CS-380B82 太陽光モジュール 380W', qty: 16, unit: 7800, owner: '三宅' },
      { id: 'i31001-02', date: '2025-05-05', vendor: '長州産業', name: 'パワーコンディショナ CS-P65G4D 6.5kW', qty: 1, unit: 42000, owner: '三宅' },
      { id: 'i31001-03', date: '2025-05-08', vendor: 'カナメ', name: '切妻屋根架台セット 16枚分', qty: 1, unit: 19800, owner: '三宅' },
      { id: 'i31001-04', date: '2025-05-10', vendor: '九電テクノ', name: 'CVケーブル 3.5sq 2C（PV用）', qty: 50, unit: 185, owner: '三宅' },
      { id: 'i31001-05', date: '2025-05-12', vendor: '九電テクノ', name: 'PV接続箱 6回路', qty: 1, unit: 8600, owner: '三宅' },
      { id: 'i31001-06', date: '2025-05-12', vendor: '九電テクノ', name: '接地棒セット（D種接地）', qty: 2, unit: 3200, owner: '三宅' },
    ],
  },
  {
    id: '31002', status: '進行中', name: '西日本シティ銀行 苅田支店 PV設置', client: '株式会社 西日本シティ銀行', category: '事業者用PV', sales: '平井',
    revenue: 7811100, cost: 1250000, budgetDiff: 3506906, profitRateEst: 82.0, profitRateAct: 84.0,
    items: [
      { id: 'i31002-01', date: '2025-04-01', vendor: 'ネクストエナジー', name: 'NER120M400E-MBH モジュール 400W', qty: 150, unit: 3600, owner: '平井' },
      { id: 'i31002-02', date: '2025-04-01', vendor: 'ネクストエナジー', name: 'PCS NX5098-HNS 49.5kW', qty: 1, unit: 280000, owner: '平井' },
      { id: 'i31002-03', date: '2025-04-05', vendor: 'カナメ', name: '折板屋根架台セット 150枚分', qty: 1, unit: 185000, owner: '平井' },
      { id: 'i31002-04', date: '2025-04-10', vendor: '九電テクノ', name: 'CVT 38sq 3C ケーブル', qty: 80, unit: 1850, owner: '平井' },
      { id: 'i31002-05', date: '2025-04-10', vendor: '九電テクノ', name: 'PV集電箱 12回路', qty: 2, unit: 28000, owner: '平井' },
      { id: 'i31002-06', date: '2025-04-15', vendor: '九電テクノ', name: '接地棒セット（C種接地）', qty: 6, unit: 4800, owner: '平井' },
      { id: 'i31002-07', date: '2025-04-18', vendor: '愛知電線', name: 'IV線 5.5sq 緑', qty: 200, unit: 120, owner: '平井' },
    ],
  },
  {
    id: '31026', status: '進行中', name: '加藤美穂様 EVパワーステーション設置工事', client: '加藤美穂様', category: 'EV充放電システム', sales: '西村',
    revenue: 1300363, cost: 358000, budgetDiff: 320000, profitRateEst: 72.0, profitRateAct: 72.5,
    items: [
      { id: 'i31026-01', date: '2025-06-01', vendor: 'ニチコン', name: 'EVパワーステーション VCG-666CN7', qty: 1, unit: 248000, owner: '西村' },
      { id: 'i31026-02', date: '2025-06-03', vendor: '九電テクノ', name: 'CV 8sq 3C ケーブル', qty: 15, unit: 480, owner: '西村' },
      { id: 'i31026-03', date: '2025-06-03', vendor: '九電テクノ', name: 'EV充電用 専用ブレーカ 30A', qty: 1, unit: 4800, owner: '西村' },
      { id: 'i31026-04', date: '2025-06-05', vendor: '九電テクノ', name: '配線ダクト 60×40 2m', qty: 5, unit: 1680, owner: '西村' },
      { id: 'i31026-05', date: '2025-06-05', vendor: '九電テクノ', name: 'コンクリート基礎ブロック', qty: 4, unit: 12500, owner: '西村' },
    ],
  },
  {
    id: '31035', status: '未着手', name: '白川（芹田・平野）発電所 等電位化工事', client: '芹田様・平野様', category: 'その他', sales: '電気工事部',
    revenue: 2600000, cost: 0, budgetDiff: 1981150, profitRateEst: 75.0, profitRateAct: 100.0,
    items: [],
  },
];

export const sampleProjects = INITIAL_PROJECTS;
