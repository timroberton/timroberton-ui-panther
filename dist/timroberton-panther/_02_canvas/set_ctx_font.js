export function setCtxFont(ctx, ti, align) {
    if (ti.font.italic) {
        ctx.font = `italic ${ti.font.weight} ${ti.fontSize}px ${ti.font.fontFamily}`;
    }
    else {
        ctx.font = `${ti.font.weight} ${ti.fontSize}px ${ti.font.fontFamily}`;
    }
    if (ti.color !== "none") {
        ctx.fillStyle = ti.color;
    }
    if (align) {
        ctx.textAlign = align;
    }
    ctx.textBaseline = "alphabetic";
}
