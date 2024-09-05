import type { ChartHeightInfo, CustomFigureStyleOptions, LegendItem, TimChartInputs, TimMapInputs, TimVizInputs } from "./deps";
export type TimFigureInputs = TimChartInputs | TimVizInputs | TimMapInputs<unknown, unknown, unknown> | TimRawImageInputs | TimFigureMultiContentInputs;
export type TimFigureMultiContentInputs = {
    figureType: "multi";
    multiContent: TimFigureMultiContentItem[];
    caption?: string;
    footnote?: string | string[];
    legendItems?: LegendItem[];
    figureStyle?: CustomFigureStyleOptions;
};
export type TimFigureMultiContentItem = {
    subCaption: string;
    content: TimChartInputs | TimVizInputs | TimMapInputs<unknown, unknown, unknown> | TimRawImageInputs;
};
export type TimRawImageInputs = {
    image: HTMLImageElement;
};
export type FigureHeightInfo = ChartHeightInfo;
export declare function isFigure(content: unknown): content is TimFigureInputs;
export declare function isChart(content: TimFigureInputs): content is TimChartInputs;
export declare function isMap(content: TimFigureInputs): content is TimMapInputs<unknown, unknown, unknown>;
export declare function isViz(content: TimFigureInputs): content is TimVizInputs;
export declare function isRawImage(content: TimFigureInputs): content is TimRawImageInputs;
export declare function isMultiContent(content: TimFigureInputs): content is TimFigureMultiContentInputs;
