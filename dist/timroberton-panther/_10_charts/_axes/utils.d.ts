import type { ColGroupExpanded, Series, TimChartDataColRowTransformed } from "../_types/mod.ts";
import { type MeasuredText, type MergedChartStyle, type PointEstimateBounds } from "../deps.ts";
export declare function getMaxValueFromAoA(aoa: PointEstimateBounds[][], stacked: boolean): number;
export declare function getMaxValuesFromSeries(series: Series[]): {
    xMaxValue: number;
    yMaxValue: number;
};
export declare function getXScaleAxisTickLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, scaleAxisTickLabels: number[], scaleAxisLabelMaxWidth: number): MeasuredText[];
export declare function getYScaleAxisTickLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, scaleAxisTickLabels: number[], scaleAxisLabelMaxWidth: number): MeasuredText[];
export declare function getXTextAxisTickLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, textAxisTickLabels: string[], textAxisLabelMaxWidth: number): MeasuredText[];
export declare function getYTextAxisTickLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, textAxisTickLabels: string[], textAxisLabelMaxWidth: number): MeasuredText[];
export declare function getVerticalXTextAxisTickLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, textAxisTickLabels: string[], maxHeight: number): MeasuredText[];
export declare function getColGroupLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, colGroupLabels: ColGroupExpanded[], maxAllowableWidths: number[]): (MeasuredText | undefined)[];
export declare function getVerticalColGroupLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, colGroupLabels: ColGroupExpanded[], maxAllowableWidths: number[]): (MeasuredText | undefined)[];
export declare function getDataLabelDimensions(ctx: CanvasRenderingContext2D, s: MergedChartStyle, data: TimChartDataColRowTransformed): MeasuredText[][];
export declare function getDataLabelDimensionsSeries(ctx: CanvasRenderingContext2D, s: MergedChartStyle, series: Series[]): (MeasuredText | undefined)[][];
export declare function getDataLabelMaxWidthAndHeight(dataLabelDimensions: MeasuredText[][]): {
    dataLabelMaxW: number;
    dataLabelMaxH: number;
};
