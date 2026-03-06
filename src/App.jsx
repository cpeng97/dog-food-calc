import { useState, useEffect } from "react";

const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #000; }
  select option { background: #1c1c1e; color: #fff; }
  .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%); border: 1px solid rgba(255,255,255,0.18); }
  .glass-light { background: rgba(255,255,255,0.13); backdrop-filter: blur(60px) saturate(200%); -webkit-backdrop-filter: blur(60px) saturate(200%); border: 1px solid rgba(255,255,255,0.22); }
  .glass-pill { background: rgba(255,255,255,0.12); backdrop-filter: blur(30px) saturate(160%); -webkit-backdrop-filter: blur(30px) saturate(160%); border: 1px solid rgba(255,255,255,0.2); }
  .glass-selected { background: rgba(255,255,255,0.22); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 0 0 1.5px rgba(255,255,255,0.6) inset, 0 4px 24px rgba(0,0,0,0.2); }
  .tap-scale { transition: transform 0.12s ease, opacity 0.12s ease; }
  .tap-scale:active { transform: scale(0.96); opacity: 0.85; }
  input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input::placeholder { color: rgba(255,255,255,0.3); }
  select { -webkit-appearance: none; appearance: none; }
  ::-webkit-scrollbar { display: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.32s cubic-bezier(0.34,1.2,0.64,1) both; }
`;

const PROTEINS = [
  { id:"turkey",  name:"火鸡胸肉", emoji:"🦃", kcal:135, protein:29, fat:1.5, coat:1, tag:"低过敏 · 诺维奇首选" },
  { id:"lamb",    name:"羊肉",     emoji:"🐑", kcal:258, protein:25, fat:17,  coat:2, tag:"富含锌 · 被毛养护" },
  { id:"salmon",  name:"三文鱼",   emoji:"🐟", kcal:208, protein:20, fat:13,  coat:3, tag:"Omega-3最强 · 被毛首选" },
  { id:"chicken", name:"鸡胸肉",   emoji:"🍗", kcal:165, protein:31, fat:3.6, coat:1, tag:"高蛋白 · 低脂" },
  { id:"beef",    name:"瘦牛肉",   emoji:"🥩", kcal:218, protein:26, fat:12,  coat:2, tag:"富含锌 · 铁" },
  { id:"egg",     name:"鸡蛋",     emoji:"🥚", kcal:155, protein:13, fat:11,  coat:3, tag:"生物素最高 · 光泽" },
  { id:"sardine", name:"沙丁鱼",   emoji:"🐠", kcal:208, protein:25, fat:11,  coat:3, tag:"EPA/DHA丰富" },
  { id:"liver",   name:"鸡肝",     emoji:"🫀", kcal:172, protein:27, fat:5,   coat:3, tag:"生物素 · 锌 · 铜" },
  { id:"pork",    name:"猪里脊",   emoji:"🐖", kcal:143, protein:26, fat:3.5, coat:1, tag:"高蛋白 · B族维生素" },
  { id:"duck",    name:"鸭胸肉",   emoji:"🦆", kcal:201, protein:23, fat:11,  coat:2, tag:"低过敏 · Omega-3" },
  { id:"tuna",    name:"金枪鱼",   emoji:"🐡", kcal:132, protein:28, fat:1,   coat:2, tag:"高蛋白 · 低脂" },
  { id:"shrimp",  name:"虾",       emoji:"🍤", kcal:99,  protein:24, fat:0.3, coat:1, tag:"低脂 · 锌 · 铜" },
];

const GOALS = [
  { id:"maintain",     label:"维持体重", icon:"⚖️",  adj:0    },
  { id:"lose",         label:"减重管理", icon:"📉",  adj:-0.2 },
  { id:"gain",         label:"增重增肌", icon:"📈",  adj:0.2  },
  { id:"coat",         label:"毛发养护", icon:"✨",  adj:0.05 },
  { id:"puppy_growth", label:"幼犬成长", icon:"🐾",  adj:0    },
  { id:"senior_care",  label:"老年养护", icon:"🌸",  adj:-0.15},
  { id:"active",       label:"高活动量", icon:"🏃",  adj:0.3  },
];

const GOAL_ADVICE = {
  maintain:     { accent:"rgba(100,200,255,0.28)", bg:"rgba(100,200,255,0.07)", title:"⚖️ 维持体重方案",  text:"均衡是关键——蛋白质维持肌肉量，适量碳水提供稳定能量，Omega-3维持关节与皮肤健康。下一步推荐鸡胸肉🍗 或火鸡🦃作为主蛋白，搭配三文鱼🐟补充DHA，蔬菜以胡萝卜和西兰花为主。" },
  lose:         { accent:"rgba(255,140,80,0.28)",  bg:"rgba(255,140,80,0.07)",  title:"📉 减重管理方案",  text:"提高蛋白质比例（55%↑）维持肌肉，大幅减少脂肪摄入，增加蔬菜饱腹感。推荐金枪鱼🐡、虾🍤、鸡胸肉🍗，蔬菜选西葫芦🥒和菠菜🌿，脂肪只用少量鱼油。" },
  gain:         { accent:"rgba(80,220,140,0.28)",  bg:"rgba(80,220,140,0.07)",  title:"📈 增重增肌方案",  text:"热量盈余+高蛋白是核心。优质蛋白帮助肌肉合成，复合碳水提供持续能量。推荐牛肉🥩、羊肉🐑、鸡蛋🥚，搭配红薯🍠，脂肪选椰子油提升热量密度。" },
  coat:         { accent:"rgba(255,210,80,0.28)",  bg:"rgba(255,210,80,0.07)",  title:"✨ 毛发养护方案",  text:"Omega-3 EPA/DHA是被毛光泽的关键，同时需要生物素、锌与维E。脂肪适度提升至24%。推荐三文鱼🐟、鸡蛋🥚、鸡肝🫀，脂肪选鱼油和亚麻籽油，营养素必选生物素与锌。" },
  puppy_growth: { accent:"rgba(255,180,80,0.28)",  bg:"rgba(255,180,80,0.07)",  title:"🐾 幼犬成长方案",  text:"幼犬需成犬2–3倍热量密度，钙磷比至关重要。高蛋白支撑骨骼与肌肉快速发育。推荐鸡肉🍗、鸡蛋🥚、三文鱼🐟，少量鸡肝补维A与铁，营养素必选骨粉和维D3。" },
  senior_care:  { accent:"rgba(200,160,255,0.28)", bg:"rgba(200,160,255,0.07)", title:"🌸 老年养护方案",  text:"热量需求下降但蛋白质不减，防止肌肉萎缩。重点补充关节、认知与消化营养。推荐三文鱼🐟、火鸡🦃、鸡蛋🥚，营养素必选葡萄糖胺与辅酶Q10。" },
  active:       { accent:"rgba(80,180,255,0.28)",  bg:"rgba(80,180,255,0.07)",  title:"🏃 高活动量方案",  text:"运动量大需更多热量与蛋白质修复肌肉，碳水是持续运动的燃料。推荐牛肉🥩、鸡胸肉🍗、三文鱼🐟，搭配红薯🍠，营养素补充镁和B族维生素。" },
};

const WIZARD = {
  proteins: {
    title:"蛋白质来源", emoji:"🥩", rule:"选 1–2 种", min:1, max:2,
    byGoal:{
      maintain:    ["chicken","turkey","salmon","beef","egg","duck"],
      lose:        ["tuna","shrimp","chicken","turkey","egg","sardine"],
      gain:        ["beef","lamb","chicken","egg","duck","pork"],
      coat:        ["salmon","egg","liver","sardine","turkey","lamb"],
      senior_care: ["salmon","turkey","egg","chicken","sardine","duck"],
      active:      ["beef","chicken","salmon","turkey","egg","lamb"],
      puppy_growth:["chicken","egg","salmon","liver","turkey","beef"],
    },
  },
  veg: {
    title:"蔬菜", emoji:"🥦", rule:"选 2–3 种", min:2, max:3,
    byGoal:{
      maintain:    [{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"β-胡萝卜素·维A"},{id:"broccoli",name:"西兰花",emoji:"🥦",note:"维C·抗氧化"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·叶酸"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"纤维·易消化"},{id:"zucchini",name:"西葫芦",emoji:"🥒",note:"低热量·水分"},{id:"peas",name:"豌豆",emoji:"🫛",note:"植物蛋白·纤维"}],
      lose:        [{id:"broccoli",name:"西兰花",emoji:"🥦",note:"高纤维·低热量"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·叶酸·低卡"},{id:"zucchini",name:"西葫芦",emoji:"🥒",note:"极低热量·饱腹"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"天然甜味·纤维"},{id:"celery",name:"芹菜",emoji:"🌾",note:"极低热量·利尿"},{id:"cucumber",name:"黄瓜",emoji:"🥒",note:"95%水分·低卡"}],
      gain:        [{id:"sweetpot",name:"红薯",emoji:"🍠",note:"优质碳水·维A"},{id:"peas",name:"豌豆",emoji:"🫛",note:"植物蛋白·碳水"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"β-胡萝卜素"},{id:"broccoli",name:"西兰花",emoji:"🥦",note:"维C·钙"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·镁"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"碳水·纤维"}],
      coat:        [{id:"blueberry",name:"蓝莓",emoji:"🫐",note:"强效抗氧化·被毛"},{id:"broccoli",name:"西兰花",emoji:"🥦",note:"维C·铜·被毛"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"维A·皮肤健康"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·叶酸"},{id:"sweetpot",name:"红薯",emoji:"🍠",note:"维A·抗氧化"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"维A·锌"}],
      senior_care: [{id:"broccoli",name:"西兰花",emoji:"🥦",note:"抗氧化·关节"},{id:"blueberry",name:"蓝莓",emoji:"🫐",note:"认知保护·抗氧化"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·维K·骨骼"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"维A·视力"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"肠胃友好·纤维"},{id:"zucchini",name:"西葫芦",emoji:"🥒",note:"低热量·易消化"}],
      active:      [{id:"sweetpot",name:"红薯",emoji:"🍠",note:"快速补充碳水"},{id:"peas",name:"豌豆",emoji:"🫛",note:"植物蛋白·碳水"},{id:"broccoli",name:"西兰花",emoji:"🥦",note:"维C·肌肉修复"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·运动恢复"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"维A·抗氧化"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"钾·肌肉功能"}],
      puppy_growth:[{id:"broccoli",name:"西兰花",emoji:"🥦",note:"钙·维C·骨骼"},{id:"carrot",name:"胡萝卜",emoji:"🥕",note:"维A·视力发育"},{id:"spinach",name:"菠菜",emoji:"🌿",note:"铁·叶酸"},{id:"sweetpot",name:"红薯",emoji:"🍠",note:"维A·碳水·发育"},{id:"pumpkin",name:"南瓜",emoji:"🎃",note:"消化友好·纤维"},{id:"peas",name:"豌豆",emoji:"🫛",note:"植物蛋白·铁"}],
    },
  },
  fats: {
    title:"优质脂肪", emoji:"🫙", rule:"选 1–2 种", min:1, max:2,
    byGoal:{
      maintain:    [{id:"fishoil",name:"鱼油",emoji:"🐟",note:"Omega-3·关节+皮肤"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"植物Omega-3·ALA"},{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·能量·抗菌"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"单不饱和·抗氧化"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"高EPA/DHA"},{id:"sunflower",name:"葵花籽油",emoji:"🌻",note:"维E·Omega-6"}],
      lose:        [{id:"fishoil",name:"鱼油",emoji:"🐟",note:"Omega-3·抑制炎症"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"植物Omega-3·低热量"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"少量·抗炎"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"高EPA/DHA·低用量"},{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·加速代谢"},{id:"hemp",name:"火麻仁油",emoji:"🌿",note:"Omega-3/6均衡"}],
      gain:        [{id:"coconut",name:"椰子油",emoji:"🥥",note:"高热量·MCT能量"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"Omega-3·肌肉恢复"},{id:"sunflower",name:"葵花籽油",emoji:"🌻",note:"维E·高热量"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"单不饱和·高密度"},{id:"fishoil",name:"鱼油",emoji:"🐟",note:"Omega-3·消炎"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"ALA·植物Omega-3"}],
      coat:        [{id:"fishoil",name:"鱼油",emoji:"🐟",note:"EPA/DHA最高·被毛光泽"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"高Omega-3·防水被毛"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"ALA·皮肤屏障"},{id:"hemp",name:"火麻仁油",emoji:"🌿",note:"Omega-3/6完美比例"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"维E·抗氧化"},{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·被毛防护"}],
      senior_care: [{id:"fishoil",name:"鱼油",emoji:"🐟",note:"Omega-3·关节保护"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"EPA/DHA·认知保护"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"植物Omega-3·抗炎"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"单不饱和·心脏健康"},{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·大脑能量"},{id:"hemp",name:"火麻仁油",emoji:"🌿",note:"Omega-3/6均衡"}],
      active:      [{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·快速能量"},{id:"fishoil",name:"鱼油",emoji:"🐟",note:"Omega-3·运动恢复"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"EPA/DHA·消炎"},{id:"sunflower",name:"葵花籽油",emoji:"🌻",note:"维E·高热量"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"ALA·持久能量"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"单不饱和·稳定能量"}],
      puppy_growth:[{id:"fishoil",name:"鱼油",emoji:"🐟",note:"DHA·大脑发育关键"},{id:"sardoil",name:"沙丁鱼油",emoji:"🐠",note:"EPA/DHA·神经发育"},{id:"flaxseed",name:"亚麻籽油",emoji:"🌱",note:"ALA·视网膜发育"},{id:"coconut",name:"椰子油",emoji:"🥥",note:"MCT·快速能量"},{id:"sunflower",name:"葵花籽油",emoji:"🌻",note:"维E·免疫发育"},{id:"olive",name:"橄榄油",emoji:"🫒",note:"单不饱和·抗炎"}],
    },
  },
  extras: {
    title:"营养素补充", emoji:"💊", rule:"选 2–3 种", min:2, max:3,
    byGoal:{
      maintain:    [{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙磷平衡·骨骼"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"肠道健康·免疫"},{id:"vit_e",name:"维生素E",emoji:"💊",note:"抗氧化·皮肤"},{id:"vit_d3",name:"维生素D3",emoji:"☀️",note:"钙吸收·免疫"},{id:"zinc",name:"锌补充",emoji:"🔩",note:"皮肤·酶·免疫"},{id:"iodine",name:"碘/海带粉",emoji:"🌊",note:"甲状腺·代谢"}],
      lose:        [{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙·骨骼维护"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"饱腹感·代谢"},{id:"lcarnitine",name:"左旋肉碱",emoji:"🔥",note:"促进脂肪燃烧"},{id:"chromium",name:"铬",emoji:"⚙️",note:"血糖稳定·减重"},{id:"vit_d3",name:"维生素D3",emoji:"☀️",note:"代谢·免疫"},{id:"magnesium",name:"镁",emoji:"🔮",note:"肌肉功能·代谢"}],
      gain:        [{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙·支撑肌肉"},{id:"bcaa",name:"支链氨基酸",emoji:"💪",note:"肌肉合成·恢复"},{id:"vit_b",name:"B族维生素",emoji:"🌟",note:"能量代谢·蛋白合成"},{id:"zinc",name:"锌",emoji:"🔩",note:"蛋白质合成·生长"},{id:"magnesium",name:"镁",emoji:"🔮",note:"肌肉收缩·恢复"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"营养吸收·肠道"}],
      coat:        [{id:"biotin",name:"生物素B7",emoji:"🥚",note:"5mg/天·减少掉毛"},{id:"zinc",name:"锌",emoji:"🔩",note:"皮炎防护·被毛"},{id:"vit_e",name:"维生素E",emoji:"💊",note:"皮肤细胞保护"},{id:"selenium",name:"硒",emoji:"✨",note:"与维E协同·抗氧化"},{id:"copper",name:"铜",emoji:"🪙",note:"被毛色素·弹性"},{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙·骨骼基础"}],
      senior_care: [{id:"glucosamine",name:"葡萄糖胺",emoji:"🦵",note:"关节软骨保护"},{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙·防骨质疏松"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"老年肠胃·消化"},{id:"vit_b",name:"B族维生素",emoji:"🌟",note:"认知·神经健康"},{id:"vit_e",name:"维生素E",emoji:"💊",note:"抗氧化·认知保护"},{id:"coq10",name:"辅酶Q10",emoji:"❤️",note:"心脏·细胞能量"}],
      active:      [{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙·骨骼承压"},{id:"magnesium",name:"镁",emoji:"🔮",note:"肌肉·疲劳恢复"},{id:"vit_b",name:"B族维生素",emoji:"🌟",note:"能量代谢"},{id:"electrolyte",name:"电解质",emoji:"💧",note:"运动补水·钠钾"},{id:"vit_c",name:"维生素C",emoji:"🍋",note:"肌肉修复·抗氧化"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"高强度后肠胃"}],
      puppy_growth:[{id:"calcium",name:"骨粉/碳酸钙",emoji:"🦴",note:"钙磷比·骨骼发育"},{id:"vit_d3",name:"维生素D3",emoji:"☀️",note:"钙吸收·骨骼"},{id:"dha",name:"DHA",emoji:"🧠",note:"大脑发育·视网膜"},{id:"vit_e",name:"维生素E",emoji:"💊",note:"免疫发育·抗氧化"},{id:"probiotic",name:"益生菌",emoji:"🌿",note:"消化系统建立"},{id:"iron",name:"铁",emoji:"🩸",note:"血红素·发育"}],
    },
  },
};

const BREED_PROFILES = {
  "诺维奇梗 Norwich Terrier": {
    flag:"norwich", stdWeightKg:[4.5,5.9],
    proteinPct:0.55, fatPct:0.20, carbsPct:0.25,
    coatProteinPct:0.52, coatFatPct:0.24, coatCarbsPct:0.24,
    healthAlerts:[
      {icon:"🦴",text:"髌骨脱臼风险：控制体重，补充葡萄糖胺"},
      {icon:"🌬️",text:"气管塌陷倾向：改用胸背带，避免颈圈"},
      {icon:"🦷",text:"易患牙周病：定期洁牙，少喂黏性零食"},
      {icon:"⚖️",text:"极易肥胖：严格控制热量，推荐慢食碗"},
    ],
    extraSupplements:[
      {icon:"🦵",name:"葡萄糖胺",note:"300–500mg/天（髌骨保护）"},
      {icon:"🦷",name:"牙齿护理酶",note:"每日涂抹或洁牙咬胶"},
      {icon:"🌿",name:"益生菌",note:"肠胃专项，2亿CFU/天"},
    ],
    mealFreq:{puppy_young:4,puppy:3,adult:3,senior:3},
  },
};
const DEFAULT = {
  proteinPct:0.50,fatPct:0.25,carbsPct:0.25,
  coatProteinPct:0.48,coatFatPct:0.28,coatCarbsPct:0.24,
  healthAlerts:[],extraSupplements:[],
  mealFreq:{puppy_young:4,puppy:3,adult:2,senior:2},
};

const BREEDS = ["诺维奇梗 Norwich Terrier","拉布拉多","金毛寻回犬","德国牧羊犬","法国斗牛犬","柯基","博美","柴犬","比熊","贵宾/泰迪","哈士奇","萨摩耶","边牧","马尔济斯","约克夏","吉娃娃","雪纳瑞","阿拉斯加","秋田","杜宾","罗威纳","大丹犬","圣伯纳","其他"];
const FORBIDDEN = ["洋葱","大蒜","葡萄","葡萄干","巧克力","木糖醇","夏威夷果","牛油果","酒精","生面团"];

function calcNutrition(wKg, stage, activity, goal, neutered, breed, selProteins) {
  const p = BREED_PROFILES[breed] || DEFAULT;
  const rer = 70 * Math.pow(wKg, 0.75);
  const isCoat = goal === "coat";
  let mult;
  if (stage==="puppy_young") mult=3.0;
  else if (stage==="puppy") mult=2.0;
  else if (stage==="senior") mult=neutered?1.2:1.3;
  else { const m={sedentary:1.4,light:1.6,moderate:1.8,active:2.0,working:2.5}; mult=m[activity]||1.6; if(neutered) mult-=0.1; }
  const gObj = GOALS.find(g=>g.id===goal);
  if (gObj) mult = Math.max(0.8, mult + gObj.adj);
  const daily = rer * mult;
  const pp = isCoat?p.coatProteinPct:p.proteinPct;
  const fp = isCoat?p.coatFatPct:p.fatPct;
  const cp = isCoat?p.coatCarbsPct:p.carbsPct;
  const protG=Math.round(daily*pp/4), fatG=Math.round(daily*fp/9), carbG=Math.round(daily*cp/4);
  const vegG=Math.round((protG+fatG+carbG)*0.18);
  const totalG=protG+fatG+carbG+vegG;
  const mealCnt=p.mealFreq?.[stage]??2;
  let plan=[];
  if (selProteins.length>0) {
    const each=Math.round(protG/selProteins.length);
    plan=selProteins.map(id=>{ const ing=PROTEINS.find(x=>x.id===id); if(!ing) return null; const fg=Math.round(each/ing.protein*100); return{...ing,foodG:fg,foodKcal:Math.round(fg*ing.kcal/100)}; }).filter(Boolean);
  }
  const coatSupps=isCoat?[{icon:"🐟",name:"三文鱼油",note:`${Math.round(wKg*50)}–${Math.round(wKg*100)}mg EPA/DHA/天`},{icon:"🥚",name:"生物素 Biotin",note:"5mg/天 — 减少掉毛改善光泽"},{icon:"🌱",name:"维生素E",note:"10mg/kg/天（与Omega-3协同）"},{icon:"🔩",name:"锌",note:"2–3mg/kg/天（皮炎防护）"},{icon:"🫐",name:"抗氧化组合",note:"蓝莓+西兰花 10–20g/天"}]:[];
  let warning=null;
  const bp=BREED_PROFILES[breed];
  if (bp?.stdWeightKg) { const[mn,mx]=bp.stdWeightKg; if(wKg>mx) warning=`体重${wKg.toFixed(1)}kg超出AKC标准（${mn}–${mx}kg）`; else if(wKg<mn) warning=`体重${wKg.toFixed(1)}kg低于标准范围（${mn}–${mx}kg）`; }
  return { rer:Math.round(rer), mult:mult.toFixed(1), daily:Math.round(daily), protein:protG, fat:fatG, carbs:carbG, veg:vegG, totalG, mealCnt, profile:p, warning, isCoat, macros:{p:Math.round(pp*100),f:Math.round(fp*100),c:Math.round(cp*100)}, plan, coatSupps };
}

function SL({children,style={}}) { return <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:10,...style}}>{children}</div>; }
function Card({children,style={},cls=""}) { return <div className={`glass ${cls}`} style={{borderRadius:20,padding:"15px 17px",marginBottom:11,...style}}>{children}</div>; }
function GBtn({children,sel,onClick,style={},disabled=false}) {
  return <button onClick={onClick} disabled={disabled} className={`tap-scale ${sel?"glass-selected":"glass"}`} style={{border:"none",borderRadius:16,color:"#fff",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontSize:14,fontWeight:sel?600:400,...style}}>{children}</button>;
}
function Arc({v,max,color,sz=60}) {
  const r=sz/2-6,c=2*Math.PI*r,pct=Math.min(v/max,1);
  return <svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5.5}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={color} strokeWidth={5.5} strokeDasharray={`${pct*c} ${c}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 4px ${color})`}}/></svg>;
}
function Dots({score}) { return <div style={{display:"flex",gap:3}}>{[1,2,3].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:i<=score?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.18)"}}/>)}</div>; }

// ─── Ingredient Wizard ────────────────────────────────────────────────────────
function IngredientWizard({goal, onDone}) {
  const [sub, setSub] = useState(0);
  const [proteins, setProteins] = useState([]);
  const [veg, setVeg] = useState([]);
  const [fats, setFats] = useState([]);
  const [extras, setExtras] = useState([]);

  const g = goal || "maintain";
  const protIds = WIZARD.proteins.byGoal[g] || WIZARD.proteins.byGoal.maintain;
  const protOpts = protIds.map(id => PROTEINS.find(p=>p.id===id)).filter(Boolean);
  const vegOpts   = WIZARD.veg.byGoal[g]   || WIZARD.veg.byGoal.maintain;
  const fatOpts   = WIZARD.fats.byGoal[g]  || WIZARD.fats.byGoal.maintain;
  const extOpts   = WIZARD.extras.byGoal[g]|| WIZARD.extras.byGoal.maintain;

  const steps = [
    {label:"蛋白质",emoji:"🥩",rule:"选 1–2 种",min:1,max:2,sel:proteins,set:setProteins,opts:protOpts},
    {label:"蔬菜",  emoji:"🥦",rule:"选 2–3 种",min:2,max:3,sel:veg,     set:setVeg,     opts:vegOpts},
    {label:"脂肪",  emoji:"🫙",rule:"选 1–2 种",min:1,max:2,sel:fats,    set:setFats,    opts:fatOpts},
    {label:"营养素",emoji:"💊",rule:"选 2–3 种",min:2,max:3,sel:extras,  set:setExtras,  opts:extOpts},
  ];
  const cur = steps[sub];
  const canNext = cur.sel.length >= cur.min;

  function goSub(s) { setSub(s); }
  function toggle(id) {
    const {sel,set,max}=cur;
    set(prev => prev.includes(id)?prev.filter(x=>x!==id):prev.length<max?[...prev,id]:prev);
  }

  const pBtn = { width:"100%",padding:"16px",borderRadius:18,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",boxShadow:"0 1px 0 rgba(255,255,255,0.3) inset,0 8px 32px rgba(0,0,0,0.25)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"1px solid rgba(255,255,255,0.3)" };

  return (
    <div>
      {/* Sub-step indicators */}
      <div style={{display:"flex",gap:8,marginBottom:22,alignItems:"flex-start"}}>
        {steps.map((s,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <div style={{width:42,height:42,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i<sub?14:20,background:i<sub?"rgba(255,255,255,0.22)":i===sub?"rgba(255,255,255,0.16)":"rgba(255,255,255,0.06)",border:i===sub?"1.5px solid rgba(255,255,255,0.55)":"1px solid rgba(255,255,255,0.12)",boxShadow:i===sub?"0 0 0 4px rgba(255,255,255,0.08)":"none",transition:"all 0.25s",color:"#fff",fontWeight:700}}>
              {i<sub?"✓":s.emoji}
            </div>
            <div style={{fontSize:10,color:i<=sub?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.22)",fontWeight:i===sub?700:400,textAlign:"center",lineHeight:1.3}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <SL style={{marginBottom:0}}>{cur.rule}</SL>
        <span style={{fontSize:12,fontWeight:700,color:canNext?"rgba(100,220,150,0.9)":"rgba(255,255,255,0.3)"}}>{cur.sel.length}/{cur.max}</span>
      </div>

      <div key={sub} className="fade-up" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {cur.opts.slice(0,6).map(opt=>{
          if(!opt) return null;
          const isSel=cur.sel.includes(opt.id), atMax=!isSel&&cur.sel.length>=cur.max;
          return (
            <button key={opt.id} onClick={()=>!atMax&&toggle(opt.id)} className={`tap-scale ${isSel?"glass-selected":"glass"}`}
              style={{padding:"14px 11px",borderRadius:18,textAlign:"left",cursor:atMax?"default":"pointer",color:"#fff",fontFamily:"inherit",border:"none",position:"relative",opacity:atMax?0.38:1,transition:"opacity 0.2s"}}>
              {isSel&&<div style={{position:"absolute",top:9,right:9,width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.92)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",fontWeight:800}}>✓</div>}
              <div style={{fontSize:30,marginBottom:7}}>{opt.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:3,lineHeight:1.3}}>{opt.name}</div>
              {sub===0&&<div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginBottom:5}}>{opt.protein}g蛋白/100g</div>}
              <div style={{fontSize:10,color:"rgba(255,205,100,0.82)",lineHeight:1.4}}>{opt.note||opt.tag}</div>
              {sub===0&&<div style={{marginTop:6}}><Dots score={opt.coat}/></div>}
            </button>
          );
        })}
      </div>

      <button onClick={()=>{ if(sub<3) goSub(sub+1); else onDone({proteins,veg,fats,extras}); }}
        disabled={!canNext} className="tap-scale"
        style={{...pBtn,opacity:canNext?1:0.35,cursor:canNext?"pointer":"not-allowed"}}>
        {sub<3?`下一步  ${steps[sub+1].emoji} ${steps[sub+1].label}`:"生成我的专属配比 🎉"}
      </button>
      {sub>0&&<button onClick={()=>goSub(sub-1)} className="tap-scale" style={{...pBtn,background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.45)",boxShadow:"none",marginTop:10}}>← 上一步</button>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [step,setStep]       = useState(0);
  const [animKey,setAnimKey] = useState(0);
  const [breed,setBreed]     = useState("诺维奇梗 Norwich Terrier");
  const [ageY,setAgeY]       = useState("");
  const [ageM,setAgeM]       = useState("");
  const [weight,setWeight]   = useState("");
  const [unit,setUnit]       = useState("kg");
  const [neutered,setNeutered]=useState(false);
  const [activity,setActivity]=useState("moderate");
  const [goal,setGoal]       = useState("maintain");
  const [result,setResult]   = useState(null);
  const [tab,setTab]         = useState("plan");
  const [showForbid,setShowForbid]=useState(false);
  const [showBreed,setShowBreed]=useState(false);

  useEffect(()=>{ const id="lgc"; if(!document.getElementById(id)){const el=document.createElement("style");el.id=id;el.textContent=GLOBAL_CSS;document.head.appendChild(el);} },[]);

  const wKg       = unit==="kg"?parseFloat(weight):parseFloat(weight)*0.453592;
  const totMo     = (parseFloat(ageY)||0)*12+(parseFloat(ageM)||0);
  const stage     = totMo<4?"puppy_young":totMo<12?"puppy":totMo>=84?"senior":"adult";
  const stageLbl  = {puppy_young:"幼犬 <4月",puppy:"幼犬",adult:"成年犬",senior:"老年犬"}[stage];
  const profile   = BREED_PROFILES[breed]||DEFAULT;
  const isNorwich = profile.flag==="norwich";
  const canGo     = breed&&ageY!==""&&weight&&parseFloat(weight)>0;

  function goTo(s){setAnimKey(k=>k+1);setStep(s);}

  const inp={width:"100%",padding:"14px 16px",borderRadius:16,color:"#fff",fontSize:16,outline:"none",fontFamily:"inherit",marginBottom:14,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(40px) saturate(180%)",WebkitBackdropFilter:"blur(40px) saturate(180%)",border:"1px solid rgba(255,255,255,0.18)"};
  const pBtn={width:"100%",padding:"17px",borderRadius:18,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(40px) saturate(200%)",WebkitBackdropFilter:"blur(40px) saturate(200%)",boxShadow:"0 1px 0 rgba(255,255,255,0.3) inset,0 8px 32px rgba(0,0,0,0.25)",color:"#fff",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:"1px solid rgba(255,255,255,0.3)"};

  const blobs=(
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{position:"absolute",top:"-10%",left:"-20%",width:"70vw",height:"70vw",maxWidth:400,maxHeight:400,borderRadius:"50%",background:"radial-gradient(circle,#FF6B6B 0%,#FF8E53 60%,transparent 80%)",opacity:0.35}}/>
      <div style={{position:"absolute",top:"25%",right:"-25%",width:"65vw",height:"65vw",maxWidth:380,maxHeight:380,borderRadius:"50%",background:"radial-gradient(circle,#4FACFE 0%,#00F2FE 60%,transparent 80%)",opacity:0.28}}/>
      <div style={{position:"absolute",bottom:"-5%",left:"5%",width:"60vw",height:"60vw",maxWidth:350,maxHeight:350,borderRadius:"50%",background:"radial-gradient(circle,#A18CD1 0%,#FBC2EB 60%,transparent 80%)",opacity:0.3}}/>
      <div style={{position:"absolute",bottom:"30%",right:"10%",width:"40vw",height:"40vw",maxWidth:220,maxHeight:220,borderRadius:"50%",background:"radial-gradient(circle,#43E97B 0%,#38F9D7 60%,transparent 80%)",opacity:0.2}}/>
      <div style={{position:"absolute",inset:0,backdropFilter:"blur(80px)",WebkitBackdropFilter:"blur(80px)",background:"rgba(10,10,20,0.45)"}}/>
    </div>
  );

  const STEPS_LBL=["基本信息","营养目标","选择食材","配比结果"];

  return (
    <div style={{fontFamily:"-apple-system,'SF Pro Display',sans-serif",minHeight:"100dvh",position:"relative",maxWidth:430,margin:"0 auto",paddingBottom:"calc(48px + env(safe-area-inset-bottom))"}}>
      {blobs}
      <div style={{position:"relative",zIndex:10,padding:"calc(52px + env(safe-area-inset-top)) 20px 0"}}>
        {step>0&&<button onClick={()=>goTo(step-1)} className="tap-scale" style={{background:"none",border:"none",color:"rgba(255,255,255,0.55)",fontSize:16,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",padding:0}}><span style={{fontSize:22}}>‹</span> 返回</button>}
        <div style={{display:"flex",gap:6,marginBottom:22}}>
          {STEPS_LBL.map((lbl,i)=>(
            <div key={i} style={{flex:1}}>
              <div style={{height:3,borderRadius:4,background:i<=step?"rgba(255,255,255,0.65)":"rgba(255,255,255,0.12)",transition:"all 0.4s"}}/>
              <div style={{fontSize:9,color:i<=step?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.2)",textAlign:"center",marginTop:4,letterSpacing:"0.04em"}}>{lbl}</div>
            </div>
          ))}
        </div>
        {step===0&&<><p style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:500,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:8}}>AKC · AAFCO · WSAVA</p><h1 style={{fontSize:34,fontWeight:700,color:"#fff",lineHeight:1.15,letterSpacing:"-0.03em",marginBottom:4}}>自制狗饭<br/>配比计算</h1></>}
        {step===1&&<h1 style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>营养目标</h1>}
        {step===2&&<h1 style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>选择食材</h1>}
        {step===3&&<h1 style={{fontSize:28,fontWeight:700,color:"#fff",letterSpacing:"-0.02em",marginBottom:4}}>今日配比</h1>}
      </div>

      <div key={animKey} className="fade-up" style={{position:"relative",zIndex:10,padding:"18px 16px"}}>

        {/* ══ STEP 0 ══ */}
        {step===0&&(
          <div>
            <SL>品种</SL>
            <select value={breed} onChange={e=>setBreed(e.target.value)} style={inp}>{BREEDS.map(b=><option key={b} value={b}>{b}</option>)}</select>
            {isNorwich&&(
              <Card style={{marginTop:-6,marginBottom:14,borderColor:"rgba(255,255,255,0.22)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>🏅 诺维奇梗专属方案</span>
                  <button onClick={()=>setShowBreed(!showBreed)} style={{fontSize:12,color:"rgba(255,255,255,0.4)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>{showBreed?"收起":"详情"}</button>
                </div>
                {showBreed&&<div style={{marginTop:9,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.9}}><div>📐 AKC标准体重：10–13 lbs（4.5–5.9 kg）</div><div>🧬 蛋白质 55%↑ · 脂肪 20%↓</div><div>✨ 被毛方案：脂肪提升至 24%（Omega-3强化）</div><div>🍽️ 成犬每日3次小餐防暴食</div></div>}
              </Card>
            )}
            <SL>年龄</SL>
            <div style={{display:"flex",gap:10}}>
              <input type="number" placeholder="岁" min="0" max="20" value={ageY} onChange={e=>setAgeY(e.target.value)} inputMode="numeric" style={{...inp,flex:1}}/>
              <input type="number" placeholder="月" min="0" max="11" value={ageM} onChange={e=>setAgeM(e.target.value)} inputMode="numeric" style={{...inp,flex:1}}/>
            </div>
            {totMo>0&&<div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:-8,marginBottom:14,paddingLeft:2}}>阶段：{stageLbl}</div>}
            <SL>体重</SL>
            <div style={{display:"flex",marginBottom:14}}>
              <input type="number" placeholder="输入体重" min="0.1" max="100" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} inputMode="decimal" style={{...inp,marginBottom:0,borderRadius:"16px 0 0 16px",flex:1,borderRight:"none"}}/>
              <div style={{display:"flex",borderRadius:"0 16px 16px 0",overflow:"hidden",border:"1px solid rgba(255,255,255,0.18)"}}>
                {["kg","lbs"].map(u=><button key={u} onClick={()=>setUnit(u)} className="tap-scale" style={{padding:"0 18px",background:unit===u?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.06)",border:"none",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>{u}</button>)}
              </div>
            </div>
            {isNorwich&&weight&&parseFloat(weight)>0&&(()=>{const w=unit==="kg"?parseFloat(weight):parseFloat(weight)*0.453592;if(w>5.9)return<div style={{fontSize:12,color:"rgba(255,200,80,0.9)",marginTop:-6,marginBottom:14,paddingLeft:2}}>⚠️ 超出AKC标准（4.5–5.9kg），建议选减重目标</div>;if(w<4.5)return<div style={{fontSize:12,color:"rgba(100,180,255,0.9)",marginTop:-6,marginBottom:14,paddingLeft:2}}>ℹ️ 低于标准范围，请配合兽医确认</div>;return null;})()}
            <SL>绝育状态</SL>
            <div style={{display:"flex",gap:10,marginBottom:26}}>
              {[{v:false,l:"未绝育",e:"🐕"},{v:true,l:"已绝育",e:"✂️"}].map(({v,l,e})=>(
                <GBtn key={l} sel={neutered===v} onClick={()=>setNeutered(v)} style={{flex:1,padding:"14px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span>{e}</span><span style={{fontSize:14}}>{l}</span></GBtn>
              ))}
            </div>
            <button onClick={()=>canGo&&goTo(1)} className="tap-scale" style={{...pBtn,opacity:canGo?1:0.35}}>下一步</button>
          </div>
        )}

        {/* ══ STEP 1: Goals ══ */}
        {step===1&&(
          <div>
            {stage!=="puppy_young"&&stage!=="puppy"&&(
              <>
                <SL>运动量</SL>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
                  {[{id:"sedentary",l:"几乎不运动",s:"居家为主"},{id:"light",l:"轻度运动",s:"短距散步"},{id:"moderate",l:"中度运动",s:"每天1–2小时"},{id:"active",l:"高度运动",s:"每天2–4小时"},{id:"working",l:"工作犬",s:"高强度持续"}].map(a=>(
                    <GBtn key={a.id} sel={activity===a.id} onClick={()=>setActivity(a.id)} style={{padding:"13px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600}}>{a.l}</span><span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{a.s}</span></GBtn>
                  ))}
                </div>
              </>
            )}
            <SL>营养目标</SL>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {GOALS.filter(g=>{ if(stage==="puppy"||stage==="puppy_young") return g.id==="puppy_growth"||g.id==="maintain"; return g.id!=="puppy_growth"; }).map(g=>(
                <GBtn key={g.id} sel={goal===g.id} onClick={()=>setGoal(g.id)} style={{padding:"16px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:26}}>{g.icon}</span>
                  <span style={{fontSize:13,fontWeight:600}}>{g.label}</span>
                  {g.id==="coat"&&<span style={{fontSize:10,color:"rgba(255,255,255,0.45)"}}>Omega-3强化</span>}
                </GBtn>
              ))}
            </div>

            {/* Goal-specific advice card */}
            {GOAL_ADVICE[goal]&&(
              <Card style={{marginBottom:20,borderColor:GOAL_ADVICE[goal].accent,background:GOAL_ADVICE[goal].bg}}>
                <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.92)",marginBottom:8}}>{GOAL_ADVICE[goal].title}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",lineHeight:1.8}}>{GOAL_ADVICE[goal].text}</div>
              </Card>
            )}

            <button onClick={()=>goTo(2)} className="tap-scale" style={pBtn}>下一步，选择食材</button>
          </div>
        )}

        {/* ══ STEP 2: Ingredient Wizard ══ */}
        {step===2&&(
          <IngredientWizard goal={goal} onDone={sel=>{
            const r=calcNutrition(wKg,stage,activity,goal,neutered,breed,sel.proteins);
            r.selVeg=sel.veg; r.selFats=sel.fats; r.selExtras=sel.extras;
            setResult(r); setTab(goal==="coat"?"coat":"plan"); goTo(3);
          }}/>
        )}

        {/* ══ STEP 3: Results ══ */}
        {step===3&&result&&(
          <div>
            {result.warning&&<Card style={{marginBottom:12,borderColor:"rgba(255,200,80,0.3)",background:"rgba(255,200,80,0.08)",padding:"11px 14px"}}><div style={{fontSize:13,color:"rgba(255,220,120,0.9)"}}>⚠️ {result.warning}</div></Card>}

            {/* Hero */}
            <Card cls="glass-light" style={{textAlign:"center",padding:"26px 18px",marginBottom:14,borderColor:"rgba(255,255,255,0.25)"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:11}}>{breed} · {stageLbl}{result.isCoat?" · ✨被毛养护":""}</div>
              <div style={{fontSize:64,fontWeight:700,color:"#fff",letterSpacing:"-4px",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{result.daily}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.42)",marginTop:8,fontWeight:500}}>千卡 / 天</div>
              <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:16}}>
                {[["RER",`${result.rer} kcal`],["系数",`×${result.mult}`],["总量",`≈${result.totalG}g`]].map(([k,v])=>(
                  <div key={k} style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:3}}>{k}</div><div style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.72)"}}>{v}</div></div>
                ))}
              </div>
            </Card>

            {/* Tabs */}
            <div className="glass-pill" style={{display:"flex",borderRadius:16,padding:4,marginBottom:14,gap:4}}>
              {[{id:"plan",l:"配比总览"},{id:"ingredients",l:"食材用量"},...(result.isCoat?[{id:"coat",l:"✨被毛"}]:[])].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className="tap-scale" style={{flex:1,padding:"10px 4px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,transition:"all 0.2s",background:tab===t.id?"rgba(255,255,255,0.22)":"transparent",color:tab===t.id?"#fff":"rgba(255,255,255,0.4)",boxShadow:tab===t.id?"0 1px 0 rgba(255,255,255,0.2) inset":"none"}}>{t.l}</button>
              ))}
            </div>

            {/* Plan tab */}
            {tab==="plan"&&(
              <div>
                {result.profile.healthAlerts?.length>0&&(
                  <div style={{marginBottom:12}}>
                    <SL>🏅 诺维奇梗健康提醒</SL>
                    {result.profile.healthAlerts.map((a,i)=>(
                      <Card key={i} style={{padding:"11px 13px",display:"flex",gap:11,alignItems:"flex-start"}}>
                        <span style={{fontSize:17,flexShrink:0}}>{a.icon}</span>
                        <span style={{fontSize:13,color:"rgba(255,255,255,0.72)",lineHeight:1.6}}>{a.text}</span>
                      </Card>
                    ))}
                  </div>
                )}
                <SL>每日营养配比</SL>
                {[{k:"protein",l:"蛋白质",v:result.protein,max:300,color:"#FF8B6E"},{k:"fat",l:"健康油脂",v:result.fat,max:80,color:"#FFD166"},{k:"carbs",l:"碳水化合物",v:result.carbs,max:200,color:"#6EE7B7"},{k:"veg",l:"蔬菜",v:result.veg,max:150,color:"#93C5FD"},{k:"calcium",l:"钙质",v:Math.round(wKg*100),max:1500,color:"#C4B5FD"}].map(n=>(
                  <Card key={n.k} style={{display:"flex",alignItems:"center",gap:13}}>
                    <Arc v={n.v} max={n.max} color={n.color} sz={58}/>
                    <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,0.88)"}}>{n.l}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-1px",fontVariantNumeric:"tabular-nums"}}>{n.v}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.32)"}}>{n.k==="calcium"?"mg":"g"}</div></div>
                  </Card>
                ))}
                <Card style={{marginTop:2}}>
                  <SL>热量占比</SL>
                  <div style={{display:"flex",justifyContent:"space-around",paddingTop:4}}>
                    {[{l:"蛋白质",pct:result.macros.p,color:"#FF8B6E"},{l:"脂肪",pct:result.macros.f,color:"#FFD166"},{l:"碳水",pct:result.macros.c,color:"#6EE7B7"}].map(m=>(
                      <div key={m.l} style={{textAlign:"center"}}>
                        <div style={{position:"relative",width:62,height:62,margin:"0 auto 7px"}}>
                          <Arc v={m.pct} max={100} color={m.color} sz={62}/>
                          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>{m.pct}%</div>
                        </div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{marginTop:2}}>
                  <SL>每日喂食计划</SL>
                  <div style={{display:"flex",justifyContent:"space-around"}}>
                    {Array.from({length:result.mealCnt}).map((_,i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div className="glass-pill" style={{width:50,height:50,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 7px"}}>🍽️</div>
                        <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.82)"}}>第{i+1}餐</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:2}}>{Math.round(result.daily/result.mealCnt)} kcal</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:13,fontSize:12,color:"rgba(255,255,255,0.38)",textAlign:"center"}}>零食上限 <strong style={{color:"rgba(255,255,255,0.65)"}}>{Math.round(result.daily*0.1)} kcal</strong>/天{isNorwich&&"  ·  推荐慢食碗"}</div>
                </Card>
                <Card style={{marginTop:2}}>
                  <SL>基础补充剂</SL>
                  {[{icon:"🐟",name:"鱼油 Omega-3",note:"1粒/天（皮肤+关节）"},{icon:"☀️",name:"维生素D3",note:"100–200 IU，每周2–3次"},{icon:"🌱",name:"维生素E",note:"5–10 IU/天（抗氧化）"},{icon:"🔬",name:"碘/海带粉",note:"微量，每周2–3次"},...(result.profile.extraSupplements||[])].map((s,i,arr)=>(
                    <div key={i} style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:i<arr.length-1?11:0,paddingBottom:i<arr.length-1?11:0,borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"}}>
                      <span style={{fontSize:19,lineHeight:"21px",flexShrink:0}}>{s.icon}</span>
                      <div><div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.84)"}}>{s.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginTop:2}}>{s.note}</div></div>
                    </div>
                  ))}
                </Card>
                <button onClick={()=>setShowForbid(!showForbid)} className="tap-scale glass" style={{width:"100%",padding:"13px 17px",borderRadius:18,border:"none",color:"rgba(255,110,110,0.9)",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",justifyContent:"space-between",fontFamily:"inherit",marginBottom:showForbid?0:11}}>
                  <span>⚠️ 绝对禁忌食物</span><span style={{fontSize:12}}>{showForbid?"收起":"展开"}</span>
                </button>
                {showForbid&&<div className="glass" style={{borderRadius:"0 0 18px 18px",borderTop:"none",padding:"13px 17px",marginBottom:11,display:"flex",flexWrap:"wrap",gap:8}}>{FORBIDDEN.map(f=><div key={f} style={{background:"rgba(255,80,80,0.12)",borderRadius:10,padding:"5px 12px",fontSize:12,color:"rgba(255,130,130,0.9)",border:"1px solid rgba(255,80,80,0.2)"}}>🚫 {f}</div>)}</div>}
              </div>
            )}

            {/* Ingredients tab */}
            {tab==="ingredients"&&(
              <div>
                {result.plan.length>0?(
                  <>
                    <SL>🥩 蛋白质用量（共 {result.protein}g）</SL>
                    {result.plan.map(ing=>(
                      <Card key={ing.id} style={{display:"flex",gap:13,alignItems:"center"}}>
                        <div style={{fontSize:34,flexShrink:0}}>{ing.emoji}</div>
                        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:3}}>{ing.name}</div><div style={{fontSize:11,color:"rgba(255,200,100,0.72)",marginBottom:5}}>{ing.tag}</div><Dots score={ing.coat}/></div>
                        <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>{ing.foodG}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.38)"}}>克/天</div><div style={{fontSize:11,color:"rgba(255,255,255,0.28)",marginTop:2}}>{ing.foodKcal} kcal</div></div>
                      </Card>
                    ))}
                    {result.selVeg?.length>0&&(
                      <>
                        <SL style={{marginTop:8}}>🥦 蔬菜（共 {result.veg}g，均分）</SL>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
                          {result.selVeg.map(v=>(
                            <div key={v.id} className="glass" style={{borderRadius:15,padding:"12px 12px",display:"flex",gap:9,alignItems:"flex-start"}}>
                              <span style={{fontSize:22,flexShrink:0}}>{v.emoji}</span>
                              <div><div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{v.name}</div><div style={{fontSize:11,color:"rgba(255,200,100,0.75)",marginTop:2}}>{v.note}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginTop:2}}>≈{Math.round(result.veg/result.selVeg.length)}g/天</div></div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {result.selFats?.length>0&&(
                      <>
                        <SL style={{marginTop:10}}>🫙 优质脂肪（共 {result.fat}g）</SL>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
                          {result.selFats.map(f=>(
                            <div key={f.id} className="glass" style={{borderRadius:15,padding:"12px 12px",display:"flex",gap:9,alignItems:"flex-start"}}>
                              <span style={{fontSize:22,flexShrink:0}}>{f.emoji}</span>
                              <div><div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{f.name}</div><div style={{fontSize:11,color:"rgba(255,200,100,0.75)",marginTop:2}}>{f.note}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginTop:2}}>≈{Math.round(result.fat/result.selFats.length)}g/天</div></div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {result.selExtras?.length>0&&(
                      <>
                        <SL style={{marginTop:10}}>💊 营养素补充</SL>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {result.selExtras.map(e=>(
                            <div key={e.id} className="glass" style={{borderRadius:15,padding:"12px 13px",display:"flex",gap:11,alignItems:"center"}}>
                              <span style={{fontSize:21,flexShrink:0}}>{e.emoji}</span>
                              <div><div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{e.name}</div><div style={{fontSize:11,color:"rgba(255,200,100,0.75)",marginTop:2}}>{e.note}</div></div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ):(
                  <div style={{textAlign:"center",padding:"44px 20px"}}>
                    <div style={{fontSize:48,marginBottom:14}}>🥩</div>
                    <div style={{fontSize:16,fontWeight:600,color:"rgba(255,255,255,0.65)",marginBottom:6}}>未选择具体食材</div>
                    <div style={{fontSize:42,fontWeight:700,color:"#fff",letterSpacing:"-2px",marginTop:12}}>{result.protein}<span style={{fontSize:18,color:"rgba(255,255,255,0.45)"}}>g</span></div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginTop:4}}>每日蛋白质总量</div>
                    <button onClick={()=>goTo(2)} className="tap-scale" style={{...pBtn,marginTop:24,width:"auto",padding:"13px 30px"}}>← 重新选食材</button>
                  </div>
                )}
              </div>
            )}

            {/* Coat tab */}
            {tab==="coat"&&result.isCoat&&(
              <div>
                <Card style={{background:"rgba(255,220,80,0.07)",borderColor:"rgba(255,220,80,0.22)"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,220,120,0.9)",marginBottom:9}}>✨ 毛发养护科学依据</div>
                  {[["蛋白质","狗毛95%由角蛋白构成，每日约30%蛋白质用于皮毛维护"],["Omega-3","EPA/DHA抗炎、增强皮肤屏障、让毛发光泽有弹性（VCA标准）"],["生物素B7","5mg/天可改善70%皮肤病犬的被毛质量"],["锌","缺锌导致掉毛和皮肤病变（Tufts大学）"],["维E+硒","协同保护皮肤细胞免受氧化损伤"]].map(([t,d])=>(
                    <div key={t} style={{fontSize:12,color:"rgba(255,255,255,0.58)",lineHeight:1.7,marginBottom:4}}><strong style={{color:"rgba(255,255,255,0.78)"}}>{t}：</strong>{d}</div>
                  ))}
                </Card>
                <SL>被毛养护补充方案</SL>
                {result.coatSupps.map((s,i)=>(
                  <Card key={i} style={{display:"flex",gap:13,alignItems:"flex-start",padding:"13px 17px"}}>
                    <span style={{fontSize:21,flexShrink:0}}>{s.icon}</span>
                    <div><div style={{fontSize:14,fontWeight:600,color:"rgba(255,220,120,0.9)"}}>{s.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.48)",marginTop:3,lineHeight:1.5}}>{s.note}</div></div>
                  </Card>
                ))}
                <SL>被毛食材排行</SL>
                {[...PROTEINS].sort((a,b)=>b.coat-a.coat).slice(0,5).map((ing,i)=>(
                  <Card key={ing.id} style={{display:"flex",gap:11,alignItems:"center",padding:"11px 15px"}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.28)",fontWeight:700,width:20}}>#{i+1}</div>
                    <span style={{fontSize:25}}>{ing.emoji}</span>
                    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.88)"}}>{ing.name}</div><div style={{fontSize:11,color:"rgba(255,200,100,0.7)",marginTop:2}}>{ing.tag}</div></div>
                    <Dots score={ing.coat}/>
                  </Card>
                ))}
                {isNorwich&&<Card style={{background:"rgba(255,140,80,0.06)",borderColor:"rgba(255,140,80,0.2)"}}><div style={{fontSize:13,fontWeight:700,color:"rgba(255,200,120,0.9)",marginBottom:7}}>🐕 诺维奇梗双层被毛护理</div><div style={{fontSize:12,color:"rgba(255,255,255,0.58)",lineHeight:1.8}}>· 每周1–2次梳理，防止底毛缠结<br/>· 每天三文鱼油保持外毛光泽和防水性<br/>· 换毛季（春/秋）可短期加量Omega-3至1.5倍</div></Card>}
              </div>
            )}

            <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",lineHeight:1.7,marginTop:14,marginBottom:14,padding:"0 4px"}}>⚕️ 本工具仅供参考，基于 AKC / AAFCO / WSAVA / VCA 标准计算。自制狗饭前请咨询执照兽医，个体差异可达 ±30–50%。</div>
            <button onClick={()=>{setResult(null);setWeight("");setAgeY("");setAgeM("");setGoal("maintain");setActivity("moderate");goTo(0);}} className="tap-scale glass" style={{width:"100%",padding:"14px",borderRadius:18,border:"none",color:"rgba(255,255,255,0.42)",cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"inherit"}}>重新计算</button>
          </div>
        )}
      </div>
    </div>
  );
}
