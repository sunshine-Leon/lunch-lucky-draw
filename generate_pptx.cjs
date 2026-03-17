const pptxgen = require("pptxgenjs");
const fs = require('fs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Lunch Lucky Draw Web App Overview';

// Define theme colors (matching the web app)
const COLORS = {
    bg: "030008",
    primary: "00F2FF",
    secondary: "7000FF",
    accent: "FF007A",
    white: "FFFFFF",
    dim: "94A3B8",
    gold: "FFCC00"
};

// --- Title Slide ---
let titleSlide = pres.addSlide();
titleSlide.background = { color: COLORS.bg };

titleSlide.addText("LUNCH DRAW", {
    x: 1, y: 1.8, w: 8, h: 1,
    fontSize: 60, fontFace: "Space Grotesk",
    color: COLORS.primary, bold: true, align: "center",
    charSpacing: 2
});

titleSlide.addText("今日就交給命運來決定吧", {
    x: 1, y: 3, w: 8, h: 0.5,
    fontSize: 24, fontFace: "Outfit",
    color: COLORS.white, align: "center"
});

titleSlide.addShape(pres.shapes.LINE, {
    x: 4, y: 3.8, w: 2, h: 0,
    line: { color: COLORS.accent, width: 3 }
});

// --- Overview Slide ---
let overviewSlide = pres.addSlide();
overviewSlide.background = { color: COLORS.bg };

overviewSlide.addText("專案概述", {
    x: 0.5, y: 0.3, w: 9, h: 0.8,
    fontSize: 36, fontFace: "Space Grotesk",
    color: COLORS.primary, bold: true
});

overviewSlide.addText([
    { text: "解決現代人「午餐吃什麼」的世紀難題。", options: { bullet: true, breakLine: true, color: COLORS.white, fontSize: 18 } },
    { text: "結合現代化網頁視覺與流暢的老虎機動畫。", options: { bullet: true, breakLine: true, color: COLORS.white, fontSize: 18 } },
    { text: "提供自訂清單、權重設定與資料持久化功能。", options: { bullet: true, color: COLORS.white, fontSize: 18 } }
], { x: 0.8, y: 1.5, w: 8.4, h: 3 });

// --- Design Slide ---
let designSlide = pres.addSlide();
designSlide.background = { color: COLORS.bg };

designSlide.addText("設計與視覺 (Rich Aesthetics)", {
    x: 0.5, y: 0.3, w: 9, h: 0.8,
    fontSize: 36, fontFace: "Space Grotesk",
    color: COLORS.primary, bold: true
});

const designPoints = [
    { title: "深色擬態 (Dark Morphism)", desc: "使用極深背景搭配玻璃質感與霓虹發光特效。" },
    { title: "動態反饋", desc: "呼吸燈 Logo、流動背景球體，讓頁面充滿生命力。" },
    { title: "老虎機滾輪", desc: "物理感垂直滾動動畫，營造期待感。" }
];

designPoints.forEach((p, i) => {
    designSlide.addShape(pres.shapes.RECTANGLE, {
        x: 0.8, y: 1.3 + (i * 1.2), w: 8.4, h: 1,
        fill: { color: COLORS.white, transparency: 95 },
        line: { color: COLORS.primary, width: 1 }
    });
    
    designSlide.addText([
        { text: p.title, options: { bold: true, color: COLORS.primary, fontSize: 16, breakLine: true } },
        { text: p.desc, options: { color: COLORS.white, fontSize: 14 } }
    ], { x: 1, y: 1.3 + (i * 1.2), w: 8, h: 1, valign: "middle" });
});

// --- Technical Features ---
let techSlide = pres.addSlide();
techSlide.background = { color: COLORS.bg };

techSlide.addText("核心技術亮點", {
    x: 0.5, y: 0.3, w: 9, h: 0.8,
    fontSize: 36, fontFace: "Space Grotesk",
    color: COLORS.primary, bold: true
});

techSlide.addText([
    { text: "權重隨機演算法 (Weighted Random Selection)", options: { bullet: true, breakLine: true, color: COLORS.white, fontSize: 18, bold: true } },
    { text: "   讓每項午餐都有自訂的出現機率。", options: { breakLine: true, color: COLORS.dim, fontSize: 16 } },
    { text: "LocalStorage 儲存", options: { bullet: true, breakLine: true, color: COLORS.white, fontSize: 18, bold: true } },
    { text: "   自動保存姓名與清單，網頁重啟不消失。", options: { breakLine: true, color: COLORS.dim, fontSize: 16 } },
    { text: "響應式設計 (RWD)", options: { bullet: true, breakLine: true, color: COLORS.white, fontSize: 18, bold: true } },
    { text: "   完美適配手機與桌面瀏覽器。", options: { color: COLORS.dim, fontSize: 16 } }
], { x: 0.8, y: 1.5, w: 8.4, h: 3.5 });

// --- Conclusion ---
let endSlide = pres.addSlide();
endSlide.background = { color: COLORS.bg };

endSlide.addText("謝謝聆聽", {
    x: 1, y: 2, w: 8, h: 1,
    fontSize: 48, fontFace: "Space Grotesk",
    color: COLORS.accent, bold: true, align: "center"
});

endSlide.addText("現在就出發去吃午餐吧！", {
    x: 1, y: 3.2, w: 8, h: 0.5,
    fontSize: 20, fontFace: "Outfit",
    color: COLORS.white, align: "center"
});

pres.writeFile({ fileName: "Lunch_Draw_Introduction.pptx" }).then(fileName => {
    console.log(`Presentation saved: ${fileName}`);
});
