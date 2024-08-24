import { addPoint, getAdjustedColor, writeText, } from "../deps.ts";
export function addPointWithDataLabel(ctx, r, s) {
    addPoint(ctx, r.pointStyle, r.x, r.y, s.pointRadius, r.color, s.pointStrokeWidth, getAdjustedColor(r.color, s.pointInnerColorStrategy));
    if (r.dataLabel) {
        if (r.dataLabel.position === "left") {
            writeText(ctx, r.dataLabel.m, r.x +
                (r.dataLabel.offsetX ?? 0) -
                (s.pointRadius + s.pointStrokeWidth / 2 + s.dataLabelGapXPoints), r.y + (r.dataLabel.offsetY ?? 0) - r.dataLabel.m.dims.h() / 2, "right");
        }
        else if (r.dataLabel.position === "right") {
            writeText(ctx, r.dataLabel.m, r.x +
                (r.dataLabel.offsetX ?? 0) +
                (s.pointRadius + s.pointStrokeWidth / 2 + s.dataLabelGapXPoints), r.y + (r.dataLabel.offsetY ?? 0) - r.dataLabel.m.dims.h() / 2, "left");
        }
        else {
            writeText(ctx, r.dataLabel.m, r.x + (r.dataLabel.offsetX ?? 0), r.dataLabel.position === "top"
                ? r.y +
                    (r.dataLabel.offsetY ?? 0) -
                    (s.pointRadius +
                        s.pointStrokeWidth / 2 +
                        s.dataLabelGapYPoints +
                        r.dataLabel.m.dims.h())
                : r.y +
                    (r.dataLabel.offsetY ?? 0) +
                    (s.pointRadius + s.pointStrokeWidth / 2 + s.dataLabelGapYPoints), "center");
        }
    }
}
