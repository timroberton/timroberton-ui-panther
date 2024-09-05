import { getAdjustedColor } from "../deps";
export function addBarOutline(ctx, outlineColInfo, s) {
    if (outlineColInfo.length === 0) {
        return;
    }
    outlineColInfo.forEach(({ color, coords }, i_outline) => {
        const outlineOpacity = s.getOutlineOpacity === "none"
            ? s.outlineOpacity
            : s.getOutlineOpacity(i_outline);
        ctx.strokeStyle = getAdjustedColor(color, {
            opacity: outlineOpacity,
        });
        ctx.lineWidth =
            s.getOutlineWidth === "none"
                ? s.axisStrokeWidth
                : s.getOutlineWidth(i_outline);
        ctx.beginPath();
        let prevCol = coords[0];
        ctx.moveTo(prevCol.xLeft, prevCol.y);
        if (s.outlineType === "straight") {
            ctx.lineTo(prevCol.xRight, prevCol.y);
            coords.slice(1).forEach((col) => {
                const colSepX = (prevCol.xRight + col.xLeft) / 2;
                ctx.lineTo(colSepX, prevCol.y);
                ctx.lineTo(colSepX, col.y);
                ctx.lineTo(col.xRight, col.y);
                prevCol = col;
            });
        }
        if (s.outlineType === "curved") {
            ctx.lineTo(prevCol.xRight, prevCol.y);
            coords.slice(1).forEach((col) => {
                ctx.bezierCurveTo(col.xLeft, prevCol.y, prevCol.xRight, col.y, col.xLeft, col.y);
                ctx.lineTo(col.xRight, col.y);
                prevCol = col;
            });
        }
        if (s.outlineType === "rounded") {
            ctx.lineTo((prevCol.xLeft + prevCol.xRight) / 2, prevCol.y);
            const radius = s.outlineRoundedRadius;
            coords.slice(1).forEach((col, i_col, arr_col) => {
                const colSepX = (prevCol.xRight + col.xLeft) / 2;
                const colSepY = (prevCol.y + col.y) / 2;
                const goodRadius = Math.min(Math.abs(prevCol.xRight - col.xLeft) / 2, Math.abs(prevCol.y - col.y) / 2, radius);
                ctx.arcTo(colSepX, prevCol.y, colSepX, colSepY, goodRadius);
                const isLastCol = i_col === arr_col.length - 1;
                const controlX = isLastCol ? col.xRight : (col.xLeft + col.xRight) / 2;
                ctx.arcTo(colSepX, col.y, controlX, col.y, goodRadius);
                ctx.lineTo(controlX, col.y);
                prevCol = col;
            });
        }
        ctx.stroke();
    });
}
