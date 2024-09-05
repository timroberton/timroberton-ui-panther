import { getColor, } from "../deps";
export function addErrorBars(ctx, r, s) {
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.strokeStyle = getColor(r.color);
    ctx.beginPath();
    if (r.horizontal) {
        ctx.moveTo(r.t - s.axisStrokeWidth / 2, r.x - r.w / 2);
        ctx.lineTo(r.t - s.axisStrokeWidth / 2, r.x + r.w / 2);
        ctx.moveTo(r.t - s.axisStrokeWidth, r.x);
        ctx.lineTo(r.b, r.x);
        ctx.moveTo(r.b - s.axisStrokeWidth / 2, r.x - r.w / 2);
        ctx.lineTo(r.b - s.axisStrokeWidth / 2, r.x + r.w / 2);
    }
    else {
        ctx.moveTo(r.x - r.w / 2, r.t + s.axisStrokeWidth / 2);
        ctx.lineTo(r.x + r.w / 2, r.t + s.axisStrokeWidth / 2);
        ctx.moveTo(r.x, r.t + s.axisStrokeWidth);
        ctx.lineTo(r.x, r.b + s.axisStrokeWidth);
        ctx.moveTo(r.x - r.w / 2, r.b + s.axisStrokeWidth / 2);
        ctx.lineTo(r.x + r.w / 2, r.b + s.axisStrokeWidth / 2);
    }
    ctx.stroke();
}
