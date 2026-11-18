// Ölçü Eleği · örnek rapor
// Gerçek bir PBIT ile aynı biçimde (DataModelSchema + Report/Layout) üretilir; böylece örnek de
// gerçek dosyalarla aynı okuyucudan geçer. Testler de bu örneği kullanır.

const NAMES = {
  tr: {
    file: 'Satış Raporu.pbit', Sales: 'Satış', Product: 'Ürün', Store: 'Mağaza', Date: 'Takvim', Stock: 'Stok', OldTargets: 'Eski Hedefler',
    Amount: 'Tutar', Cost: 'Maliyet', OrderNo: 'SiparişNo', DateCol: 'Tarih', ProductKey: 'ÜrünKodu', StoreKey: 'MağazaKodu', Discount: 'İskonto', Note: 'Not', LineProfit: 'Satır Kârı',
    ProductName: 'Ürün Adı', Category: 'Kategori', Color: 'Renk', Weight: 'Ağırlık', StoreName: 'Mağaza Adı', Region: 'Bölge',
    Year: 'Yıl', MonthName: 'Ay Adı', MonthNo: 'Ay No', Week: 'Hafta', Out: 'Çıkış', OnHand: 'Mevcut', Target: 'Hedef',
    mTotal: 'Toplam Satış', mCost: 'Toplam Maliyet', mGross: 'Brüt Kâr', mMargin: 'Kâr Marjı %', mOrders: 'Sipariş Sayısı', mBasket: 'Ortalama Sepet',
    mLY: 'Geçen Yıl Satış', mGrowth: 'Yıllık Büyüme %', mColor: 'Marj Rengi', mTitle: 'Seçili Bölge Başlığı', mOldTarget: 'Eski Hedef', mGap: 'Hedefe Uzaklık',
    mTest: 'Test Ölçüsü', mDisc: 'Ortalama İskonto', mTurn: 'Stok Devir Hızı', mRevenue: 'Ciro', folder: 'Arşiv',
    cmt: '// 2023 bütçe çalışmasından kaldı', titlePrefix: 'Bölge: ', all: 'Tümü',
    pOverview: 'Genel Bakış', pTip: 'Müşteri İpucu', pOld: 'Eski Deneme',
    vRevenue: 'Ciro', vOrders: 'Sipariş', vMonthly: 'Aylık Satış', vProducts: 'Ürün Tablosu', vBasket: 'Sepet', vDisc: 'İskonto', vRegion: 'Bölgeler'
  },
  en: {
    file: 'Sales Report.pbit', Sales: 'Sales', Product: 'Product', Store: 'Store', Date: 'Calendar', Stock: 'Stock', OldTargets: 'Old Targets',
    Amount: 'Amount', Cost: 'Cost', OrderNo: 'OrderNo', DateCol: 'Date', ProductKey: 'ProductKey', StoreKey: 'StoreKey', Discount: 'Discount', Note: 'Note', LineProfit: 'Line Profit',
    ProductName: 'Product Name', Category: 'Category', Color: 'Color', Weight: 'Weight', StoreName: 'Store Name', Region: 'Region',
    Year: 'Year', MonthName: 'Month Name', MonthNo: 'Month No', Week: 'Week', Out: 'Outflow', OnHand: 'On Hand', Target: 'Target',
    mTotal: 'Total Sales', mCost: 'Total Cost', mGross: 'Gross Profit', mMargin: 'Margin %', mOrders: 'Order Count', mBasket: 'Average Basket',
    mLY: 'Sales LY', mGrowth: 'YoY Growth %', mColor: 'Margin Color', mTitle: 'Selected Region Title', mOldTarget: 'Old Target', mGap: 'Gap to Target',
    mTest: 'Test Measure', mDisc: 'Average Discount', mTurn: 'Stock Turnover', mRevenue: 'Revenue', folder: 'Archive',
    cmt: '// left over from the 2023 budget work', titlePrefix: 'Region: ', all: 'All',
    pOverview: 'Overview', pTip: 'Customer Tooltip', pOld: 'Old Draft',
    vRevenue: 'Revenue', vOrders: 'Orders', vMonthly: 'Monthly Sales', vProducts: 'Product Table', vBasket: 'Basket', vDisc: 'Discount', vRegion: 'Regions'
  }
};

const q = s => /^[A-Za-z_]\w*$/.test(s) ? s : `'${s.replace(/'/g, "''")}'`;

export function sampleName(lang) { return (NAMES[lang] || NAMES.tr).file; }

export function sampleEntries(lang) {
  const N = NAMES[lang] || NAMES.tr, S = N.Sales, ref = (t, c) => `${q(t)}[${c}]`;
  const col = (name, extra) => ({ name, ...(extra || {}) });
  const meas = (name, expression, extra) => ({ name, expression, ...(extra || {}) });
  const schema = { name: N.file, model: {
    tables: [
      { name: S, columns: [col(N.Amount), col(N.Cost), col(N.OrderNo), col(N.DateCol), col(N.ProductKey), col(N.StoreKey), col(N.Discount), col(N.Note, { isHidden: true }),
        col(N.LineProfit, { type: 'calculated', expression: `${ref(S, N.Amount)} - ${ref(S, N.Cost)}` })],
        measures: [
          meas(N.mTotal, `SUM(${ref(S, N.Amount)})`),
          meas(N.mCost, `SUM(${ref(S, N.Cost)})`),
          meas(N.mGross, `[${N.mTotal}] - [${N.mCost}]`),
          meas(N.mMargin, `DIVIDE([${N.mGross}], [${N.mTotal}])`),
          meas(N.mOrders, `DISTINCTCOUNT(${ref(S, N.OrderNo)})`),
          meas(N.mBasket, `DIVIDE([${N.mTotal}], [${N.mOrders}])`),
          meas(N.mLY, `CALCULATE(\n    [${N.mTotal}],\n    SAMEPERIODLASTYEAR(${ref(N.Date, N.DateCol)})\n)`),
          meas(N.mGrowth, `DIVIDE([${N.mTotal}] - [${N.mLY}], [${N.mLY}])`),
          meas(N.mColor, `IF([${N.mMargin}] < 0.2, "#D64545", "#2E8B57")`, { isHidden: true }),
          meas(N.mTitle, `"${N.titlePrefix}" & SELECTEDVALUE(${ref(N.Store, N.Region)}, "${N.all}")`),
          meas(N.mOldTarget, `SUM(${ref(N.OldTargets, N.Target)})`, { displayFolder: N.folder }),
          meas(N.mGap, `${N.cmt}\n[${N.mTotal}] - [${N.mOldTarget}]`, { displayFolder: N.folder }),
          meas(N.mTest, `COUNTROWS(${q(S)})`),
          meas(N.mDisc, `AVERAGE(${ref(S, N.Discount)})`),
          meas(N.mTurn, `DIVIDE(SUM(${ref(N.Stock, N.Out)}), AVERAGE(${ref(N.Stock, N.OnHand)}))`),
          meas(N.mRevenue, `sum( ${ref(S, N.Amount)} )`)
        ] },
      { name: N.Product, columns: [col(N.ProductKey), col(N.ProductName), col(N.Category), col(N.Color), col(N.Weight)] },
      { name: N.Store, columns: [col(N.StoreKey), col(N.StoreName), col(N.Region)] },
      { name: N.Date, columns: [col(N.DateCol), col(N.Year), col(N.MonthName, { sortByColumn: N.MonthNo }), col(N.MonthNo, { isHidden: true }), col(N.Week)] },
      { name: N.Stock, columns: [col(N.ProductKey), col(N.Out), col(N.OnHand)] },
      { name: N.OldTargets, isHidden: true, columns: [col(N.Year), col(N.Target)] }
    ],
    relationships: [
      { name: 'r1', fromTable: S, fromColumn: N.ProductKey, toTable: N.Product, toColumn: N.ProductKey },
      { name: 'r2', fromTable: S, fromColumn: N.StoreKey, toTable: N.Store, toColumn: N.StoreKey },
      { name: 'r3', fromTable: S, fromColumn: N.DateCol, toTable: N.Date, toColumn: N.DateCol },
      { name: 'r4', fromTable: N.Stock, fromColumn: N.ProductKey, toTable: N.Product, toColumn: N.ProductKey }
    ]
  } };

  const M = (p) => ({ Measure: { Expression: { SourceRef: { Source: 's' } }, Property: p }, Name: S + '.' + p });
  const C = (alias, p) => ({ Column: { Expression: { SourceRef: { Source: alias } }, Property: p }, Name: p });
  const direct = (p) => ({ expr: { Measure: { Expression: { SourceRef: { Entity: S } }, Property: p } } });
  const from = [{ Name: 's', Entity: S, Type: 0 }, { Name: 'u', Entity: N.Product, Type: 0 }, { Name: 't', Entity: N.Date, Type: 0 }, { Name: 'm', Entity: N.Store, Type: 0 }];
  const vis = (type, title, select, extra) => ({ x: 0, y: 0, width: 300, height: 200, config: JSON.stringify({ name: type + (title || ''), singleVisual: { visualType: type,
    prototypeQuery: { Version: 2, From: from, Select: select },
    vcObjects: title ? { title: [{ properties: { text: { expr: { Literal: { Value: "'" + title + "'" } } } } }] } : undefined, ...(extra || {}) } }), filters: '[]' });
  const catFilter = { name: 'f1', expression: { Column: { Expression: { SourceRef: { Entity: N.Product } }, Property: N.Category } }, type: 'Categorical' };
  const layout = { config: '{}', filters: '[]', sections: [
    { name: 'S1', displayName: N.pOverview, config: '{}', filters: JSON.stringify([catFilter]), visualContainers: [
      vis('card', N.vRevenue, [M(N.mTotal)]),
      vis('card', N.vOrders, [M(N.mOrders)]),
      vis('slicer', null, [C('t', N.Year)]),
      vis('lineChart', N.vMonthly, [C('t', N.MonthName), M(N.mTotal), M(N.mGrowth)]),
      vis('tableEx', N.vProducts, [C('u', N.ProductName), M(N.mGross), M(N.mMargin)], { objects: { values: [{ properties: { backColor: { solid: { color: direct(N.mColor) } } } }] } }),
      vis('clusteredBarChart', null, [C('m', N.Region), M(N.mTotal)], { vcObjects: { title: [{ properties: { text: direct(N.mTitle) } }] } })
    ] },
    { name: 'S2', displayName: N.pTip, config: JSON.stringify({ visibility: 1, pageBinding: { type: 'Tooltip', name: 'b' } }), filters: '[]', visualContainers: [vis('card', N.vBasket, [M(N.mBasket)])] },
    { name: 'S3', displayName: N.pOld, config: JSON.stringify({ visibility: 1 }), filters: '[]', visualContainers: [vis('card', N.vDisc, [M(N.mDisc)])] }
  ] };
  const enc = s => new TextEncoder().encode(s);
  return [
    { path: 'DataModelSchema', read: async () => enc(JSON.stringify(schema)) },
    { path: 'Report/Layout', read: async () => enc(JSON.stringify(layout)) }
  ];
}
