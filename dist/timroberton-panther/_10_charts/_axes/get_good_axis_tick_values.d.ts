import { type MeasuredText } from "../deps.ts";
export declare function getGoodAxisTickValuesFromMaxValue(maxValue: number, minValue: number, startingNTicks: number, formatter: (v: number) => string): number[];
export declare function getPropotionOfYAxisTakenUpByTicks(yAxisTickLabelDimensions: MeasuredText[], gridStrokeWidth: number, chartAreaHeight: number): number;
