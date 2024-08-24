import { setCtxFont } from "./set_ctx_font.ts";
export function writeText(ctx, mText, x, y, align) {
    setCtxFont(ctx, mText.ti, align);
    mText.lines.forEach((line) => {
        if (line.text === "HIDE_THIS") {
            return;
        }
        ctx.fillText(line.text, x, y + line.y);
    });
}
export function writeVerticalText(ctx, mText, x, y, verticalAlign, horizontalAlign, rotation) {
    const align2 = rotation === "anticlockwise"
        ? verticalAlign === "top"
            ? "right"
            : verticalAlign === "bottom"
                ? "left"
                : "center"
        : verticalAlign === "top"
            ? "left"
            : verticalAlign === "bottom"
                ? "right"
                : "center";
    const angle = rotation === "anticlockwise" ? -0.5 : 0.5;
    const y2 = rotation === "anticlockwise"
        ? horizontalAlign === "left"
            ? 0
            : horizontalAlign === "center"
                ? (0 - mText.dims.w()) / 2
                : 0 - mText.dims.w()
        : horizontalAlign === "left"
            ? 0 - mText.dims.w()
            : horizontalAlign === "center"
                ? (0 - mText.dims.w()) / 2
                : 0;
    setCtxFont(ctx, mText.ti, align2);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI * angle);
    mText.lines.forEach((line) => {
        ctx.fillText(line.text, 0, y2 + line.y);
    });
    ctx.restore();
}
