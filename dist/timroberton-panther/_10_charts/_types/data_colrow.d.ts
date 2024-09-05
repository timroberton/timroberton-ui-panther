import type { Csv, CsvOptions, LegendItem, PointEstimateBounds } from "../deps";
export type TimChartDataColRow = {
    csv: Csv<number | string> | CsvOptions<number | string>;
    colNumbersOrHeadersToTake?: number[] | string[];
    rowNumbersOrHeadersToTake?: number[] | string[];
    sortRows?: {
        colNumberOrHeader: number | string;
        direction: "ascending" | "descending";
    };
    sortCols?: {
        rowNumberOrHeader: number | string;
        direction: "ascending" | "descending";
    };
    uncertaintyBounds?: "none" | "from-adjacent-cols" | "from-adjacent-rows";
    transpose?: boolean;
    labelReplacements?: Record<string, string>;
    textAxisLabel?: string;
    scaleAxisLabel?: string;
    colGroups?: ColGroupAsNumbersOrStrings[];
    legendItems?: LegendItem[];
};
export type TimChartDataColRowTransformed = {
    aoa: PointEstimateBounds[][];
    colHeaders: string[];
    rowHeaders: string[];
    textAxisLabel?: string;
    scaleAxisLabel?: string;
    colGroups?: ColGroupAsNumbers[];
    legendItems?: LegendItem[];
};
export type ColGroupAsNumbersOrStrings = ColGroupAsNumbers | ColGroupAsStrings;
export type ColGroupAsNumbers = {
    label: string | undefined;
    colNumbers: number[];
};
export type ColGroupAsStrings = {
    label: string | undefined;
    colHeaders: string[];
};
