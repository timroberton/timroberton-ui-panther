import { Dimensions, measureText, } from "./deps";
import { getLegendItemsInGroups } from "./utils";
export function measureLegend(ctx, legendItems, s) {
    const legendItemsInGroups = getLegendItemsInGroups(s.reverseOrder ? legendItems.toReversed() : legendItems, s.maxLegendItemsInOneColumn);
    let legendW = 0;
    let legendH = 0;
    const anyPoints = legendItems.some((li) => li.pointStyle !== undefined && li.pointStyle !== "as-block");
    const colorBoxWidthOrPointWidth = anyPoints
        ? s.legendPointRadius * 2 + s.legendPointStrokeWidth
        : s.legendColorBoxWidth;
    const groups = legendItemsInGroups.map((legendItemsThisGroup) => {
        let wThisGroupLabels = 0;
        let hThisGroup = 0;
        const allMeasuredLines = legendItemsThisGroup.map((legendItem) => {
            const m = measureText(ctx, legendItem.label, s.text, Number.POSITIVE_INFINITY);
            wThisGroupLabels = Math.max(wThisGroupLabels, m.dims.w());
            hThisGroup += m.dims.h();
            return m;
        });
        hThisGroup += (legendItemsThisGroup.length - 1) * s.legendItemVerticalGap;
        legendW += colorBoxWidthOrPointWidth + s.legendLabelGap + wThisGroupLabels;
        legendH = Math.max(legendH, hThisGroup);
        return { allMeasuredLines, legendItemsThisGroup, wThisGroupLabels };
    });
    legendW += (groups.length - 1) * (2 * s.legendLabelGap);
    return {
        dimensions: new Dimensions({ w: legendW, h: legendH }),
        groups,
        colorBoxWidthOrPointWidth,
        s,
    };
}
