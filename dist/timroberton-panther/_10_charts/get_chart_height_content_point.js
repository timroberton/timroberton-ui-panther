import { getHeightAxesXScaleYText } from "./_axes/get_height_axes_xscale_ytext.ts";
import { getColHeight } from "./_helpers/get_col_height.ts";
import { sum } from "./deps.ts";
export function getChartHeightContentPoint(ctx, data, w, s) {
    if (s.horizontal === true) {
        const { nonContentH, colGroups } = getHeightAxesXScaleYText(ctx, data, w, s);
        const colContent = sum(colGroups.map((colGroup) => getColHeight(colGroup, 1, s)));
        const colGroupGapAndExtraStroke = s.yTextAxis.colGroupGap > 0
            ? s.yTextAxis.colGroupGap + s.gridStrokeWidth // Not sure about this for point chart
            : 0;
        const extraForColGroups = s.yTextAxis.paddingTop +
            (colGroups.length - 1) * colGroupGapAndExtraStroke +
            s.yTextAxis.paddingBottom;
        return colContent + extraForColGroups + nonContentH;
    }
    if (s.horizontal === false) {
        return 500;
    }
    throw new Error("Will not happen");
}
