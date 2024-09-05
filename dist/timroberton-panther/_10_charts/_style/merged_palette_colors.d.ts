import type { TimChartDataColRowTransformed, TimChartDataSankey, TimChartDataXYTransformed } from "../_types/mod";
import { type CustomFigureStyle, type StyleFuncString } from "../deps";
export type MergedPaletteColors = {
    paletteType: "single";
    color: string;
} | {
    paletteType: "by-row";
    colors: string[];
} | {
    paletteType: "by-col";
    colors: string[];
} | {
    paletteType: "func";
    func: StyleFuncString;
};
export declare function getMergedPaletteColorsColRow(data: TimChartDataColRowTransformed, cs: CustomFigureStyle): MergedPaletteColors;
export declare function getMergedPaletteColorsXY(data: TimChartDataXYTransformed, cs: CustomFigureStyle): MergedPaletteColors;
export declare function getMergedPaletteColorsSankey(data: TimChartDataSankey, cs: CustomFigureStyle): MergedPaletteColors;
