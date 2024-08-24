import type { ColGroupExpanded, TimChartDataColRowTransformed } from "../_types/mod.ts";
import { RectCoordsDims, type MeasuredText, type MergedChartStyle } from "../deps.ts";
export declare function addAxesXScaleYText(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, chartType: "bar" | "point", yAxisTicks: "ends" | "center"): {
    colGroups: ColGroupExpanded[];
    xMax: number;
    xMin: number;
    dataLabelDimensions: MeasuredText[][];
};
