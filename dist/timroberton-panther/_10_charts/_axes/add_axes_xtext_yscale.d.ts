import type { ColGroupExpanded, TimChartDataColRowTransformed } from "../_types/mod";
import { RectCoordsDims, type MeasuredText, type MergedChartStyle } from "../deps";
export declare function addAxesXTextYScale(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, chartType: "bar" | "point", xAxisTicks: "ends" | "center"): {
    colGroups: ColGroupExpanded[];
    yMax: number;
    yMin: number;
    dataLabelDimensions: MeasuredText[][];
};
