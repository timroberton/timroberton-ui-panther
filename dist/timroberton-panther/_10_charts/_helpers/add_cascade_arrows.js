import { Padding, RectCoordsDims, getColor, measureText, writeText, } from "../deps.ts";
export function addCascadeArrow(ctx, from, to, label, fromBarCenterX, toBarCenterX, arrowColor, upperLabel, chartAreaY, s) {
    if (to.y < from.y) {
        return;
        // throw new Error("Arrows only work for decreasing bars");
    }
    ctx.lineWidth = s.cascadeArrows.arrowStrokeWidth;
    const fromX = from.x - s.cascadeArrows.arrowStrokeWidth / 2;
    const fromY = from.y + s.cascadeArrows.arrowStrokeWidth / 2;
    const toX = to.x + s.cascadeArrows.arrowStrokeWidth / 2;
    const toY = to.y + s.cascadeArrows.arrowStrokeWidth / 2;
    const midX = (toX + fromX) / 2;
    const diffY = toY - fromY;
    const lengthOfArrowWithGracefulTrunk = s.cascadeArrows.arrowHeadLength * 1.5;
    ctx.strokeStyle = getColor(arrowColor);
    const arrowGap = ((toX - fromX) * (1 - s.cascadeArrows.arrowLengthPctOfSpace)) / 2;
    if (diffY < lengthOfArrowWithGracefulTrunk + arrowGap) {
        ctx.beginPath();
        ctx.moveTo(fromX + arrowGap, fromY);
        const hypot = lengthOfArrowWithGracefulTrunk + arrowGap;
        const arrowGapPct = arrowGap / (lengthOfArrowWithGracefulTrunk + arrowGap);
        const xShiftLeft = Math.sqrt(hypot * hypot - diffY * diffY);
        const arrowGapX = arrowGapPct * xShiftLeft;
        const arrowGapY = arrowGapPct * diffY;
        const controlPointX = toX - xShiftLeft;
        const controlPointY = fromY;
        ctx.bezierCurveTo(controlPointX, controlPointY, controlPointX, controlPointY, toX - arrowGapX, toY - arrowGapY);
        addArrowHeadToPath(ctx, controlPointX, controlPointY, toX - arrowGapX, toY - arrowGapY, s.cascadeArrows.arrowHeadLength);
        ctx.stroke();
    }
    else {
        ctx.beginPath();
        ctx.moveTo(fromX + arrowGap, fromY);
        const controlPointX = toX;
        const controlPointY = fromY;
        ctx.bezierCurveTo(controlPointX, controlPointY, controlPointX, controlPointY, toX, toY - arrowGap);
        addArrowHeadToPath(ctx, controlPointX, controlPointY, toX, toY - arrowGap, s.cascadeArrows.arrowHeadLength);
        ctx.stroke();
    }
    if (label !== undefined) {
        const m = measureText(ctx, s.cascadeArrows.arrowLabelFormatter(label, {
            rowHeader: "",
            colHeader: "",
            rowIndex: -1,
            colIndex: -1,
        }), s.text.arrowLabels, Number.POSITIVE_INFINITY);
        const labelY = fromY -
            (s.cascadeArrows.arrowStrokeWidth / 2 +
                m.dims.h() +
                s.cascadeArrows.arrowLabelGap);
        writeText(ctx, m, midX, labelY, "center");
        // Upper label
        if (upperLabel !== undefined) {
            const colW = toBarCenterX - fromBarCenterX;
            const upperLabelWidth = colW * s.cascadeArrows.upperLabelWidthPctOfCol;
            const xOffset = (colW - upperLabelWidth) / 2;
            addUpperLabel(ctx, upperLabel, fromBarCenterX + xOffset, upperLabelWidth, from.y - s.cascadeArrows.upperLabelGapFromChartAreaY, labelY - s.cascadeArrows.arrowLabelGap, s);
        }
    }
}
function addArrowHeadToPath(ctx, fromXForAngleOnly, fromYForAngleOnly, toX, toY, arrowHeadLength) {
    const dx = toX - fromXForAngleOnly;
    const dy = toY - fromYForAngleOnly;
    const angle = Math.atan2(dy, dx);
    ctx.moveTo(toX - arrowHeadLength * Math.cos(angle - Math.PI / 6), toY - arrowHeadLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - arrowHeadLength * Math.cos(angle + Math.PI / 6), toY - arrowHeadLength * Math.sin(angle + Math.PI / 6));
}
function addUpperLabel(ctx, upperLabel, x, w, upperLabelBottomY, arrowTopY, s) {
    if (upperLabel.label === undefined) {
        return;
    }
    const pad = new Padding(upperLabel.padding ?? 5).toScaled(s.alreadyScaledValue);
    const maxBoxTextWidth = w - pad.totalPx();
    const m = measureText(ctx, upperLabel.label, s.text.cascadeArrowUpperLabels, maxBoxTextWidth);
    const actualBoxWidth = m.dims.w() + pad.totalPx();
    const xOffset = (w - actualBoxWidth) / 2;
    const boxRpd = new RectCoordsDims({
        x: x + xOffset,
        y: upperLabelBottomY - (m.dims.h() + pad.totalPy()),
        w: actualBoxWidth,
        h: m.dims.h() + pad.totalPy(),
    });
    if (upperLabel.backgroundColor) {
        ctx.fillStyle = getColor(upperLabel.backgroundColor);
        ctx.fillRect(boxRpd.x(), boxRpd.y(), boxRpd.w(), boxRpd.h());
    }
    const boxStrokeWidth = s.alreadyScaledValue * (upperLabel.borderStrokeWidth ?? 0);
    if (boxStrokeWidth > 0) {
        ctx.lineWidth = boxStrokeWidth;
        ctx.strokeStyle = getColor(upperLabel.borderColor ?? { key: "baseContent" });
        const strokePrd = new RectCoordsDims(boxRpd).getPadded(new Padding(boxStrokeWidth / 2));
        ctx.strokeRect(strokePrd.x(), strokePrd.y(), strokePrd.w(), strokePrd.h());
    }
    const midX = x + w / 2;
    writeText(ctx, m, midX, upperLabelBottomY - (m.dims.h() + pad.pb()), "center");
    const verticalLineStrokeWidth = s.alreadyScaledValue * (upperLabel.verticalLineStrokeWidth ?? 2);
    if (verticalLineStrokeWidth > 0) {
        ctx.lineWidth = verticalLineStrokeWidth;
        ctx.strokeStyle = getColor(upperLabel.verticalLineColor ?? { key: "baseContent" });
        const verticalLineDash = upperLabel.verticalLineDash ?? [6, 6];
        if (verticalLineDash) {
            ctx.setLineDash(verticalLineDash.map((v) => v * s.alreadyScaledValue));
        }
        ctx.beginPath();
        ctx.moveTo(midX, upperLabelBottomY);
        ctx.lineTo(midX, arrowTopY);
        const arrowHeadLength = s.alreadyScaledValue * (upperLabel.verticalLineArrowHeadLength ?? 0);
        if (arrowHeadLength > 0) {
            addArrowHeadToPath(ctx, midX, upperLabelBottomY, midX, arrowTopY, arrowHeadLength);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
}
export function getHeightOfUpperLabelBox(ctx, upperLabel, w, s) {
    if (upperLabel.label === undefined) {
        return 0;
    }
    const pad = new Padding(upperLabel.padding ?? 5).toScaled(s.alreadyScaledValue);
    const m = measureText(ctx, upperLabel.label, s.text.cascadeArrowUpperLabels, w - pad.totalPx());
    return m.dims.h() + pad.totalPy();
}
