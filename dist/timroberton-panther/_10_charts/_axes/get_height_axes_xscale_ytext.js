import { measureText, } from "../deps.ts";
import { getColGroupsExpandedFromDataColRow } from "./get_col_groups_expanded_from_data_colrow.ts";
import { getGoodAxisTickValuesFromMaxValue } from "./get_good_axis_tick_values.ts";
import { getMaxValueFromAoA, getXScaleAxisTickLabelDimensions, } from "./utils.ts";
export function getHeightAxesXScaleYText(ctx, data, w, s) {
    const { colGroups } = getColGroupsExpandedFromDataColRow(data);
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    // Get initial widths
    const startingNTicks = 6;
    // data.aoa[0].forEach((_, i_col) => {
    //   console.log(sum(data.aoa.map((row) => row[i_col])));
    // });
    const maxValue = s.xScaleAxis.max === "auto"
        ? getMaxValueFromAoA(data.aoa, s.stacked === "stacked")
        : s.xScaleAxis.max;
    const minXValue = s.xScaleAxis.min === "auto"
        ? (() => {
            throw new Error("Not yet implemented");
        })()
        : s.xScaleAxis.min;
    const xAxisTickValues = getGoodAxisTickValuesFromMaxValue(maxValue, minXValue, startingNTicks, s.xScaleAxis.tickLabelFormatter);
    const xAxisTickLabelDimensions = getXScaleAxisTickLabelDimensions(ctx, s, xAxisTickValues, Number.POSITIVE_INFINITY);
    const { h: xAxisTickLabelHeight } = xAxisTickLabelDimensions
        .at(-1)
        .dims.asObject();
    let mXAxisLabel = undefined;
    let xAxisLabelAndGapHeight = 0;
    if (data.scaleAxisLabel?.trim()) {
        mXAxisLabel = measureText(ctx, data.scaleAxisLabel.trim(), s.text.xScaleAxisLabel, Number.POSITIVE_INFINITY);
        xAxisLabelAndGapHeight = mXAxisLabel.dims.h() + s.xScaleAxis.labelGap;
    }
    const nonContentH = xAxisLabelAndGapHeight +
        xAxisTickLabelHeight +
        s.xScaleAxis.tickLabelGap +
        s.xScaleAxis.tickHeight +
        s.axisStrokeWidth;
    return { nonContentH, colGroups };
}
