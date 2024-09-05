import { addPoint, getAdjustedColor, getColor, writeText, } from "./deps";
export function addLegend(ctx, coords, mLegend) {
    let currentX = coords.x();
    let currentY = coords.y();
    let overallItemIndex = 0;
    const colorBoxWidthOrPointWidth = mLegend.colorBoxWidthOrPointWidth;
    mLegend.groups.forEach(({ allMeasuredLines, legendItemsThisGroup, wThisGroupLabels }) => {
        allMeasuredLines.forEach((mText, i_legendItem) => {
            writeText(ctx, mText, currentX + colorBoxWidthOrPointWidth + mLegend.s.legendLabelGap, currentY, "left");
            const pointStyle = legendItemsThisGroup[i_legendItem].pointStyle;
            if (pointStyle === undefined || pointStyle === "as-block") {
                ctx.fillStyle = getColor(legendItemsThisGroup[i_legendItem].color);
                ctx.fillRect(currentX, currentY, colorBoxWidthOrPointWidth, mText.dims.h());
            }
            else {
                addPoint(ctx, pointStyle, currentX + colorBoxWidthOrPointWidth / 2, currentY + mText.dims.h() / 2, mLegend.s.legendPointRadius, legendItemsThisGroup[i_legendItem].color, mLegend.s.legendPointStrokeWidth, getAdjustedColor(legendItemsThisGroup[i_legendItem].color, mLegend.s.legendPointInnerColorStrategy));
            }
            currentY += mText.dims.h() + mLegend.s.legendItemVerticalGap;
            overallItemIndex++;
        });
        currentX +=
            colorBoxWidthOrPointWidth +
                mLegend.s.legendLabelGap +
                wThisGroupLabels +
                2 * mLegend.s.legendLabelGap;
        currentY = coords.y();
    });
}
