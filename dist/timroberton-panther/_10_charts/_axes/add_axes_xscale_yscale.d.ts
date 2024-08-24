import type { TimChartDataXYTransformed } from "../_types/mod.ts";
import { RectCoordsDims, type MeasuredText, type MergedChartStyle } from "../deps.ts";
export declare function addAxesXScaleYScale(ctx: CanvasRenderingContext2D, data: TimChartDataXYTransformed, rpd: RectCoordsDims, s: MergedChartStyle): {
    chartArea: RectCoordsDims;
    xMax: number;
    yMax: number;
    xMin: number;
    yMin: number;
    dataLabelDimensions: (MeasuredText | undefined)[][];
    xAxisTickValues: number[];
};
