import type { ColGroupExpanded, TimChartDataColRowTransformed } from "../_types/mod.ts";
import { RectCoordsDims, type MeasuredText, type MergedChartStyle } from "../deps.ts";
export declare function addAxesXTextYScale(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, chartType: "bar" | "point", xAxisTicks: "ends" | "center"): {
    colGroups: ColGroupExpanded[];
    yMax: number;
    yMin: number;
    dataLabelDimensions: MeasuredText[][];
};
