import { type ColorAdjustmentStrategy, type ColorKeyOrString, type CustomStyleTextOptions, type PaddingOptions, type PointStyle, type TextInfoOptions } from "./deps";
import type { CsvCellFormatterFunc, StyleFuncBoolean, StyleFuncColorKeyOrString, StyleFuncUpperLabel } from "./style_func_types";
import type { DataLabelPositionOffset, LegendItemsSource, LegendPosition, PaletteLogic } from "./types";
export type CustomFigureStyleOptions = {
    scale?: number;
    padding?: PaddingOptions;
    paletteColors?: {
        logic?: PaletteLogic;
        single?: ColorKeyOrString;
        auto?: {
            first?: ColorKeyOrString;
            last?: ColorKeyOrString;
        };
        specific?: ColorKeyOrString[];
        func?: StyleFuncColorKeyOrString;
    };
    palettePointStyles?: {
        logic?: PaletteLogic;
        single?: PointStyle;
        auto?: PointStyle[];
        specific?: PointStyle[];
    };
    text?: {
        base?: TextInfoOptions;
        caption?: CustomStyleTextOptions;
        footnote?: CustomStyleTextOptions;
        subCaption?: CustomStyleTextOptions;
        xTextAxisTickLabels?: CustomStyleTextOptions;
        xScaleAxisTickLabels?: CustomStyleTextOptions;
        xTextAxisLabel?: CustomStyleTextOptions;
        xScaleAxisLabel?: CustomStyleTextOptions;
        yTextAxisTickLabels?: CustomStyleTextOptions;
        yScaleAxisTickLabels?: CustomStyleTextOptions;
        yTextAxisLabel?: CustomStyleTextOptions;
        yScaleAxisLabel?: CustomStyleTextOptions;
        colGroupLabels?: CustomStyleTextOptions;
        dataLabels?: CustomStyleTextOptions;
        arrowLabels?: CustomStyleTextOptions;
        cascadeArrowUpperLabels?: CustomStyleTextOptions;
        legend?: CustomStyleTextOptions;
        sankeyLabels?: CustomStyleTextOptions;
    };
    legendItemsSource?: LegendItemsSource;
    legend?: {
        legendPosition?: LegendPosition;
        maxLegendItemsInOneColumn?: number | number[];
        reverseOrder?: boolean;
        legendColorBoxWidth?: number;
        legendItemVerticalGap?: number;
        legendLabelGap?: number;
        legendPointRadius?: number;
        legendPointStrokeWidth?: number;
        legendPointInnerColorStrategy?: ColorAdjustmentStrategy;
    };
    sankey?: {
        labelBottomGap?: number;
        labelRightGap?: number;
        itemGap?: number;
        itemWidth?: number;
    };
    xTextAxis?: {
        verticalTickLabels?: boolean;
        maxVerticalTickLabelHeightAsPctOfChart?: number;
        showGrid?: boolean;
        paddingLeft?: number;
        paddingRight?: number;
        labelGap?: number;
        tickHeight?: number;
        tickLabelGap?: number;
        tickLabelPaddingX?: number;
        colGroupGap?: number;
        colGroupLabelPaddingX?: number;
        colGroupBracketGapTop?: number;
        colGroupBracketGapBottom?: number;
        colGroupBracketPaddingX?: number;
        colGroupBracketTickHeight?: number;
    };
    xScaleAxis?: {
        max?: number | "auto";
        min?: number | "auto";
        showGrid?: boolean;
        labelGap?: number;
        tickHeight?: number;
        tickLabelGap?: number;
        tickLabelFormatter?: (v: number) => string;
    };
    yTextAxis?: {
        colHeight?: number;
        showGrid?: boolean;
        paddingTop?: number;
        paddingBottom?: number;
        labelGap?: number;
        tickWidth?: number;
        tickLabelGap?: number;
        logicTickLabelWidth?: "auto" | "fixed";
        logicColGroupLabelWidth?: "auto" | "fixed";
        maxTickLabelWidthAsPctOfChart?: number;
        maxColGroupLabelWidthAsPctOfChart?: number;
        colGroupGap?: number;
        colGroupBracketGapLeft?: number;
        colGroupBracketGapRight?: number;
        colGroupBracketPaddingY?: number;
        colGroupBracketTickWidth?: number;
        verticalColGroupLabels?: boolean;
    };
    yScaleAxis?: {
        max?: number | "auto";
        min?: number | "auto";
        showGrid?: boolean;
        labelGap?: number;
        tickWidth?: number;
        tickLabelGap?: number;
        tickLabelFormatter?: (v: number) => string;
        forceTopOverhangHeight?: "none" | number;
    };
    multiChart?: {
        logicContentHeights?: "equal" | "specific";
        subChartGapX?: number;
        subChartGapY?: number;
        nPerRow?: number;
        nSlotsToSkip?: number;
        subCaptionGap?: number;
    };
    axisStrokeWidth?: number;
    gridStrokeWidth?: number;
    colGroupBracketStrokeWidth?: number;
    axisColor?: ColorKeyOrString;
    gridColor?: ColorKeyOrString;
    colGroupBracketColor?: ColorKeyOrString;
    backgroundColor?: ColorKeyOrString | "none";
    textAxisTickLabelFormatter?: (v: string) => string;
    dataLabelFormatter?: CsvCellFormatterFunc<number, string>;
    dataLabelPositions?: CsvCellFormatterFunc<number, DataLabelPositionOffset> | undefined;
    arrowLabelFormatter?: CsvCellFormatterFunc<number, string>;
    dataLabelGapYPoints?: number;
    dataLabelGapXPoints?: number;
    dataLabelGapYBars?: number;
    dataLabelGapXBars?: number;
    dataLabelOffsetXBars?: number;
    dataLabelPositionVerticalScale?: "alternating" | "left" | "right";
    dataLabelPositionHorizontalScale?: "alternating" | "top" | "bottom";
    dataLabelPositionTwoWayScale?: "left" | "right" | "top" | "bottom";
    pctOfCol?: number;
    pctOfSeries?: number;
    stacked?: "not-stacked" | "stacked" | "imposed";
    horizontal?: boolean;
    withBars?: boolean;
    withOutline?: boolean;
    withDataLabels?: boolean;
    barOpacity?: number;
    pointRadius?: number;
    pointStrokeWidth?: number;
    pointInnerColorStrategy?: ColorAdjustmentStrategy;
    errorBarColorStrategy?: ColorAdjustmentStrategy;
    errorBarWidthProportionOfPoint?: number;
    errorBarWidthProportionOfBar?: number;
    legendGap?: number;
    captionGap?: number;
    footnoteGap?: number;
    withArrows?: boolean | StyleFuncBoolean;
    arrowGap?: number;
    arrowLength?: number;
    arrowLabelGap?: number;
    arrowColor?: ColorKeyOrString;
    cascadeArrows?: {
        showArrows?: boolean | StyleFuncBoolean;
        arrowColor?: ColorKeyOrString | StyleFuncColorKeyOrString;
        arrowLabelFormatter?: CsvCellFormatterFunc<number, string>;
        arrowStrokeWidth?: number;
        arrowLengthPctOfSpace?: number;
        arrowHeadLength?: number;
        arrowLabelGap?: number;
        upperLabels?: "none" | StyleFuncUpperLabel;
        upperLabelWidthPctOfCol?: number;
        upperLabelGapFromChartAreaY?: number;
    };
    outlineOpacity?: number;
    getOutlineOpacity?: "none" | ((index: number) => number);
    outlineType?: "straight" | "curved" | "rounded";
    outlineRoundedRadius?: number;
    getOutlineWidth?: "none" | ((index: number) => number);
};
export declare function setGlobalFigureStyle(gs: CustomFigureStyleOptions): void;
export declare function getGlobalFigureStyle(): CustomFigureStyleOptions;
