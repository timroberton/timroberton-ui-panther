import type { MergedSurroundsStyle } from "../_05_surrounds/deps.ts";
import { type CustomFigureStyleOptions } from "./_2_custom_figure_style_options.ts";
import type { MergedChartStyle, MergedLegendStyle, MergedMultiContentStyle, MergedPaletteColorStyle, MergedPalettePointStylesStyle } from "./_3_merged_style_return_types.ts";
import { type TextInfo } from "./deps.ts";
export declare class CustomFigureStyle {
    private _d;
    private _g;
    private _c;
    private _sf;
    constructor(customStyle: CustomFigureStyleOptions | undefined, responsiveScale?: number);
    baseText(): TextInfo;
    getMergedChartStyle(): MergedChartStyle;
    getMergedSurroundsStyle(): MergedSurroundsStyle;
    getMergedLegendStyle(): MergedLegendStyle;
    getMergedPaletteColorsStyle(): MergedPaletteColorStyle;
    getMergedPalettePointStylesStyle(): MergedPalettePointStylesStyle;
    getMergedMultiContentStyle(): MergedMultiContentStyle;
    getMergedChartFontsToRegister(): string[];
}
