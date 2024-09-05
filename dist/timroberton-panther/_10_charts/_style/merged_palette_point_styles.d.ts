import type { TimChartDataColRowTransformed, TimChartDataSankey, TimChartDataXYTransformed } from "../_types/mod";
import type { CustomFigureStyle, PointStyle } from "../deps";
export type MergedPalettePointStyles = {
    paletteType: "single";
    pointStyle: PointStyle;
} | {
    paletteType: "by-row";
    pointStyles: PointStyle[];
} | {
    paletteType: "by-col";
    pointStyles: PointStyle[];
};
export declare function getMergedPalettePointStylesColRow(data: TimChartDataColRowTransformed, cs: CustomFigureStyle): MergedPalettePointStyles;
export declare function getMergedPalettePointStylesXY(data: TimChartDataXYTransformed, cs: CustomFigureStyle): MergedPalettePointStyles;
export declare function getMergedPalettePointStylesSankey(data: TimChartDataSankey, cs: CustomFigureStyle): MergedPalettePointStyles;
export declare function getAutoPointStyles(pointStyles: PointStyle[], nPoints: number): PointStyle[];
