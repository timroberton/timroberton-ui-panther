import { getHeightAxesXScaleYText } from "./_axes/get_height_axes_xscale_ytext";
import { getColHeight } from "./_helpers/get_col_height";
import { sum } from "./deps";
export function getChartHeightContentBar(ctx, data, w, s) {
    if (s.horizontal === true) {
        const { nonContentH, colGroups } = getHeightAxesXScaleYText(ctx, data, w, s);
        const colContent = sum(colGroups.map((colGroup) => getColHeight(colGroup, data.rowHeaders.length, s)));
        const colGroupGapAndExtraStroke = s.yTextAxis.colGroupGap > 0
            ? s.yTextAxis.colGroupGap + s.gridStrokeWidth
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
