import { Dimensions } from "./deps";
import { setCtxFont } from "./set_ctx_font";
export function measureText(ctx, text, ti, maxWidth) {
    if (!text.trim()) {
        return {
            lines: [],
            dims: new Dimensions({ w: 0, h: 0 }),
            ti,
        };
    }
    setCtxFont(ctx, ti, undefined);
    const words = text.split(" ");
    let currentLine = "";
    let testLine = "";
    let currentW = 0;
    let currentY = 0;
    let overallMaxWidth = 0;
    const lines = [];
    for (let i = 0; i < words.length; i++) {
        testLine += `${words[i]} `;
        const metrics = ctx.measureText(testLine.trim());
        const testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            currentY += metrics.fontBoundingBoxAscent;
            lines.push({
                text: currentLine.trim(),
                w: currentW,
                y: currentY,
            });
            currentY += metrics.fontBoundingBoxDescent;
            currentLine = `${words[i]} `;
            testLine = `${words[i]} `;
        }
        else {
            currentLine = testLine;
            currentW = testWidth;
            overallMaxWidth = Math.max(overallMaxWidth, testWidth);
        }
        if (i === words.length - 1) {
            currentY += metrics.fontBoundingBoxAscent;
            lines.push({
                text: currentLine.trim(),
                w: currentW,
                y: currentY,
            });
            currentY += metrics.fontBoundingBoxDescent;
        }
    }
    return {
        lines,
        dims: new Dimensions({ w: overallMaxWidth, h: Math.round(currentY) }),
        ti,
    };
}
export function measureVerticalText(ctx, text, ti, maxHeight) {
    const m = measureText(ctx, text, ti, maxHeight);
    return {
        lines: m.lines,
        dims: m.dims.getTransposed(), // Note this
        ti,
    };
}
