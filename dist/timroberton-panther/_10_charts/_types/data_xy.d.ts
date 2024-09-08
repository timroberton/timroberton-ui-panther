import type { ColorKeyOrString, Csv, CsvOptions, DataLabelPositionOffset, LegendItem, PointEstimateBounds } from "../deps";
export type TimChartDataXY = {
    csv: Csv<number | string> | CsvOptions<number | string>;
    xColNumber: number;
    yColNumber: number;
    transpose?: boolean;
    uncertaintyBounds?: "none" | "from-adjacent-cols" | "from-adjacent-rows";
    xAxisLabel?: string;
    yAxisLabel?: string;
    dataLabelPositionMap?: DataLabelPositionOffsetMap;
    labelReplacements?: Record<string, string>;
    lines?: LineFunction[];
    legendItems?: LegendItem[];
};
export type TimChartDataXYTransformed = {
    series: Series[];
    xAxisLabel?: string;
    yAxisLabel?: string;
    dataLabelPositionMap?: DataLabelPositionOffsetMap;
    lines?: LineFunction[];
    legendItems?: LegendItem[];
};
export type Series = {
    label?: string;
    values: {
        label?: string;
        x: PointEstimateBounds;
        y: PointEstimateBounds;
    }[];
};
export type DataLabelPositionOffsetMap = Record<string, DataLabelPositionOffset>;
export type LineFunction = {
    color?: ColorKeyOrString;
    strokeWidth?: number;
    lineFunction: (x: number) => number | undefined;
    nIncrements?: number;
};
