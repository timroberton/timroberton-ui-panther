import { getColor } from "./deps.ts";
export const _POINT_STYLES = [
    "circle",
    "crossRot",
    "rectRot",
    "cross",
    "rect",
    "triangle",
];
const _COSINE_45 = 0.7071067811865476;
const _SINE_60 = 0.8660254037844386;
const _COSINE_60 = 0.5;
export function getPointStyle(pointStyles, pointIndex) {
    if (pointIndex < pointStyles.length - 1) {
        return pointStyles[pointIndex];
    }
    const goodPointIndex = pointIndex % pointStyles.length;
    return pointStyles[goodPointIndex];
}
export function addPoint(ctx, pointStyle, x, y, radius, color, strokeWidth, innerColor) {
    switch (pointStyle) {
        case "circle":
            drawCircle(ctx, x, y, radius, innerColor, color, strokeWidth);
            return;
        case "cross":
            drawCross(ctx, x, y, radius, color, strokeWidth);
            return;
        case "rect":
            drawRect(ctx, x, y, radius, innerColor, color, strokeWidth);
            return;
        case "crossRot":
            drawCrossRot(ctx, x, y, radius, color, strokeWidth);
            return;
        case "rectRot":
            drawRectRot(ctx, x, y, radius, innerColor, color, strokeWidth);
            return;
        case "triangle":
            drawTriangle(ctx, x, y, radius, innerColor, color, strokeWidth);
            return;
    }
}
export function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    const fillStr = getColor(fill);
    if (fillStr !== "none") {
        ctx.fillStyle = fillStr;
        ctx.fill();
    }
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        ctx.strokeStyle = strokeStr;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}
export function drawCrossRot(ctx, x, y, radius, stroke, strokeWidth) {
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        const sideGivenRadius = radius * _COSINE_45;
        ctx.strokeStyle = strokeStr;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(x - sideGivenRadius, y - sideGivenRadius);
        ctx.lineTo(x + sideGivenRadius, y + sideGivenRadius);
        ctx.moveTo(x + sideGivenRadius, y - sideGivenRadius);
        ctx.lineTo(x - sideGivenRadius, y + sideGivenRadius);
        ctx.stroke();
    }
}
export function drawRect(ctx, x, y, radius, fill, stroke, strokeWidth) {
    const sideGivenRadius = radius * _COSINE_45;
    ctx.beginPath();
    ctx.rect(x - sideGivenRadius, y - sideGivenRadius, sideGivenRadius * 2, sideGivenRadius * 2);
    const fillStr = getColor(fill);
    if (fillStr !== "none") {
        ctx.fillStyle = fillStr;
        ctx.fill();
    }
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeStr;
        ctx.stroke();
    }
}
export function drawCross(ctx, x, y, radius, stroke, strokeWidth) {
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        ctx.strokeStyle = strokeStr;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x, y + radius);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x - radius, y);
        ctx.stroke();
    }
}
export function drawRectRot(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius, y);
    ctx.closePath();
    const fillStr = getColor(fill);
    if (fillStr !== "none") {
        ctx.fillStyle = fillStr;
        ctx.fill();
    }
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        ctx.strokeStyle = strokeStr;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}
export function drawTriangle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius * _SINE_60, y + radius * _COSINE_60);
    ctx.lineTo(x - radius * _SINE_60, y + radius * _COSINE_60);
    ctx.closePath();
    const fillStr = getColor(fill);
    if (fillStr !== "none") {
        ctx.fillStyle = fillStr;
        ctx.fill();
    }
    const strokeStr = getColor(stroke);
    if (strokeStr !== "none") {
        ctx.strokeStyle = strokeStr;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}
