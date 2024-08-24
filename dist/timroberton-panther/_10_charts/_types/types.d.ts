import type { ColorKeyOrString, CustomFigureStyleOptions } from "../deps.ts";
import type { TimChartDataColRow } from "./data_colrow.ts";
import type { TimChartDataSankey } from "./data_sankey.ts";
import type { TimChartDataXY } from "./data_xy.ts";
export type TimChartInputs = TimChartInputsBar | TimChartInputsSankey | TimChartInputsPoint | TimChartInputsScatter;
export type TimChartInputsBar = {
    chartType: "bar";
    caption?: string;
    footnote?: string | string[];
    chartData: TimChartDataColRow;
    chartStyle?: CustomFigureStyleOptions;
};
export type TimChartInputsPoint = {
    chartType: "point";
    caption?: string;
    footnote?: string | string[];
    chartData: TimChartDataColRow;
    chartStyle?: CustomFigureStyleOptions;
};
export type TimChartInputsScatter = {
    chartType: "scatter";
    caption?: string;
    footnote?: string | string[];
    chartData: TimChartDataXY;
    chartStyle?: CustomFigureStyleOptions;
};
export type TimChartInputsSankey = {
    chartType: "sankey";
    caption?: string;
    footnote?: string | string[];
    chartData: TimChartDataSankey;
    chartStyle?: CustomFigureStyleOptions;
};
export type TimChartPossibleHeights = {
    minH: number;
    preferredH: number;
    maxH: number;
};
export type ColGroupExpanded = {
    display: boolean;
    label: string;
    cols: ColGroupExpandedCol[];
};
export type ColGroupExpandedCol = {
    colIndexInAoA: number;
    coords: {
        x: number;
        cx: number;
        y: number;
        cy: number;
        w: number;
        h: number;
    };
};
export type Coords = {
    x: number;
    y: number;
};
export type OutlineColInfo = {
    color: ColorKeyOrString;
    coords: {
        xLeft: number;
        xRight: number;
        y: number;
    }[];
};
export type ChartHeightInfo = {
    ideal: number;
    max?: number;
    min?: number;
};
