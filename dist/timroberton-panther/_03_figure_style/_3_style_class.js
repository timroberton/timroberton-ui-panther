import { getDefaultFigureStyle, } from "./_1_default_figure_style";
import { getGlobalFigureStyle, } from "./_2_custom_figure_style_options";
import { Padding, getColor, getFont, getFontInfoId, } from "./deps";
import { getStyleFuncString } from "./style_func_types";
export class CustomFigureStyle {
    _d;
    _g;
    _c;
    _sf;
    constructor(customStyle, responsiveScale) {
        this._d = getDefaultFigureStyle();
        this._g = getGlobalFigureStyle();
        this._c = customStyle ?? {};
        this._sf =
            (this._c?.scale ?? this._g?.scale ?? this._d.scale) *
                (responsiveScale ?? 1);
    }
    baseText() {
        const c = this._c;
        const g = this._g;
        const d = this._d;
        const sf = this._sf;
        return {
            font: m(c.text?.base?.font, g.text?.base?.font, d.baseText.font),
            fontSize: ms(sf, c.text?.base?.fontSize, g.text?.base?.fontSize, d.baseText.fontSize),
            color: m(c.text?.base?.color, g.text?.base?.color, d.baseText.color),
            lineHeight: m(c.text?.base?.lineHeight, g.text?.base?.lineHeight, d.baseText.lineHeight),
        };
    }
    ////////////////////////////////////////////////////////
    //   ______   __                              __      //
    //  /      \ /  |                            /  |     //
    // /$$$$$$  |$$ |____    ______    ______   _$$ |_    //
    // $$ |  $$/ $$      \  /      \  /      \ / $$   |   //
    // $$ |      $$$$$$$  | $$$$$$  |/$$$$$$  |$$$$$$/    //
    // $$ |   __ $$ |  $$ | /    $$ |$$ |  $$/   $$ | __  //
    // $$ \__/  |$$ |  $$ |/$$$$$$$ |$$ |        $$ |/  | //
    // $$    $$/ $$ |  $$ |$$    $$ |$$ |        $$  $$/  //
    //  $$$$$$/  $$/   $$/  $$$$$$$/ $$/          $$$$/   //
    //                                                    //
    ////////////////////////////////////////////////////////
    getMergedChartStyle() {
        const c = this._c;
        const g = this._g;
        const d = this._d;
        const sf = this._sf;
        const baseText = this.baseText();
        return {
            alreadyScaledValue: sf,
            horizontal: m(c.horizontal, g.horizontal, d.horizontal),
            stacked: m(c.stacked, g.stacked, d.stacked),
            withBars: m(c.withBars, g.withBars, d.withBars),
            withOutline: m(c.withOutline, g.withOutline, d.withOutline),
            withArrows: m(c.withArrows, g.withArrows, d.withArrows),
            withDataLabels: m(c.withDataLabels, g.withDataLabels, d.withDataLabels),
            ///
            ///
            text: {
                xTextAxisTickLabels: getTextInfo(c.text?.xTextAxisTickLabels, g.text?.xTextAxisTickLabels, baseText),
                xScaleAxisTickLabels: getTextInfo(c.text?.xScaleAxisTickLabels, g.text?.xScaleAxisTickLabels, baseText),
                xTextAxisLabel: getTextInfo(c.text?.xTextAxisLabel, g.text?.xTextAxisLabel, baseText),
                xScaleAxisLabel: getTextInfo(c.text?.xScaleAxisLabel, g.text?.xScaleAxisLabel, baseText),
                yTextAxisTickLabels: getTextInfo(c.text?.yTextAxisTickLabels, g.text?.yTextAxisTickLabels, baseText),
                yScaleAxisTickLabels: getTextInfo(c.text?.yScaleAxisTickLabels, g.text?.yScaleAxisTickLabels, baseText),
                yTextAxisLabel: getTextInfo(c.text?.yTextAxisLabel, g.text?.yTextAxisLabel, baseText),
                yScaleAxisLabel: getTextInfo(c.text?.yScaleAxisLabel, g.text?.yScaleAxisLabel, baseText),
                colGroupLabels: getTextInfo(c.text?.colGroupLabels, g.text?.colGroupLabels, baseText),
                dataLabels: getTextInfo(c.text?.dataLabels, g.text?.dataLabels, baseText),
                arrowLabels: getTextInfo(c.text?.arrowLabels, g.text?.arrowLabels, baseText),
                cascadeArrowUpperLabels: getTextInfo(c.text?.cascadeArrowUpperLabels, g.text?.cascadeArrowUpperLabels, baseText),
                sankeyLabels: getTextInfo(c.text?.sankeyLabels, g.text?.sankeyLabels, baseText),
            },
            legendItemsSource: m(c.legendItemsSource, g.legendItemsSource, d.legendItemsSource),
            sankey: {
                labelBottomGap: ms(sf, c.sankey?.labelBottomGap, g.sankey?.labelBottomGap, d.sankey.labelBottomGap),
                labelRightGap: ms(sf, c.sankey?.labelRightGap, g.sankey?.labelRightGap, d.sankey.labelRightGap),
                itemGap: ms(sf, c.sankey?.itemGap, g.sankey?.itemGap, d.sankey.itemGap),
                itemWidth: ms(sf, c.sankey?.itemWidth, g.sankey?.itemWidth, d.sankey.itemWidth),
            },
            xTextAxis: {
                verticalTickLabels: m(c.xTextAxis?.verticalTickLabels, g.xTextAxis?.verticalTickLabels, d.xTextAxis?.verticalTickLabels),
                maxVerticalTickLabelHeightAsPctOfChart: m(c.xTextAxis?.maxVerticalTickLabelHeightAsPctOfChart, g.xTextAxis?.maxVerticalTickLabelHeightAsPctOfChart, d.xTextAxis?.maxVerticalTickLabelHeightAsPctOfChart),
                showGrid: m(c.xTextAxis?.showGrid, g.xTextAxis?.showGrid, d.xTextAxis.showGrid),
                paddingLeft: ms(sf, c.xTextAxis?.paddingLeft, g.xTextAxis?.paddingLeft, d.xTextAxis.paddingLeft),
                paddingRight: ms(sf, c.xTextAxis?.paddingRight, g.xTextAxis?.paddingRight, d.xTextAxis.paddingRight),
                labelGap: ms(sf, c.xTextAxis?.labelGap, g.xTextAxis?.labelGap, d.xTextAxis.labelGap),
                tickHeight: ms(sf, c.xTextAxis?.tickHeight, g.xTextAxis?.tickHeight, d.xTextAxis.tickHeight),
                tickLabelGap: ms(sf, c.xTextAxis?.tickLabelGap, g.xTextAxis?.tickLabelGap, d.xTextAxis.tickLabelGap),
                tickLabelPaddingX: ms(sf, c.xTextAxis?.tickLabelPaddingX, g.xTextAxis?.tickLabelPaddingX, d.xTextAxis.tickLabelPaddingX),
                colGroupGap: ms(sf, c.xTextAxis?.colGroupGap, g.xTextAxis?.colGroupGap, d.xTextAxis.colGroupGap),
                colGroupLabelPaddingX: ms(sf, c.xTextAxis?.colGroupLabelPaddingX, g.xTextAxis?.colGroupLabelPaddingX, d.xTextAxis.colGroupLabelPaddingX),
                colGroupBracketGapTop: ms(sf, c.xTextAxis?.colGroupBracketGapTop, g.xTextAxis?.colGroupBracketGapTop, d.xTextAxis.colGroupBracketGapTop),
                colGroupBracketGapBottom: ms(sf, c.xTextAxis?.colGroupBracketGapBottom, g.xTextAxis?.colGroupBracketGapBottom, d.xTextAxis.colGroupBracketGapBottom),
                colGroupBracketPaddingX: ms(sf, c.xTextAxis?.colGroupBracketPaddingX, g.xTextAxis?.colGroupBracketPaddingX, d.xTextAxis.colGroupBracketPaddingX),
                colGroupBracketTickHeight: ms(sf, c.xTextAxis?.colGroupBracketTickHeight, g.xTextAxis?.colGroupBracketTickHeight, d.xTextAxis.colGroupBracketTickHeight),
            },
            xScaleAxis: {
                max: m(c.xScaleAxis?.max, g.xScaleAxis?.max, d.xScaleAxis.max),
                min: m(c.xScaleAxis?.min, g.xScaleAxis?.min, d.xScaleAxis.min),
                showGrid: m(c.xScaleAxis?.showGrid, g.xScaleAxis?.showGrid, d.xScaleAxis.showGrid),
                labelGap: ms(sf, c.xScaleAxis?.labelGap, g.xScaleAxis?.labelGap, d.xScaleAxis.labelGap),
                tickHeight: ms(sf, c.xScaleAxis?.tickHeight, g.xScaleAxis?.tickHeight, d.xScaleAxis.tickHeight),
                tickLabelGap: ms(sf, c.xScaleAxis?.tickLabelGap, g.xScaleAxis?.tickLabelGap, d.xScaleAxis.tickLabelGap),
                tickLabelFormatter: m(c.xScaleAxis?.tickLabelFormatter, g.xScaleAxis?.tickLabelFormatter, d.xScaleAxis.tickLabelFormatter),
            },
            yTextAxis: {
                colHeight: ms(sf, c.yTextAxis?.colHeight, g.yTextAxis?.colHeight, d.yTextAxis.colHeight),
                showGrid: m(c.yTextAxis?.showGrid, g.yTextAxis?.showGrid, d.yTextAxis.showGrid),
                paddingTop: ms(sf, c.yTextAxis?.paddingTop, g.yTextAxis?.paddingTop, d.yTextAxis.paddingTop),
                paddingBottom: ms(sf, c.yTextAxis?.paddingBottom, g.yTextAxis?.paddingBottom, d.yTextAxis.paddingBottom),
                labelGap: ms(sf, c.yTextAxis?.labelGap, g.yTextAxis?.labelGap, d.yTextAxis.labelGap),
                tickWidth: ms(sf, c.yTextAxis?.tickWidth, g.yTextAxis?.tickWidth, d.yTextAxis.tickWidth),
                tickLabelGap: ms(sf, c.yTextAxis?.tickLabelGap, g.yTextAxis?.tickLabelGap, d.yTextAxis.tickLabelGap),
                logicTickLabelWidth: m(c.yTextAxis?.logicTickLabelWidth, g.yTextAxis?.logicTickLabelWidth, d.yTextAxis.logicTickLabelWidth),
                logicColGroupLabelWidth: m(c.yTextAxis?.logicColGroupLabelWidth, g.yTextAxis?.logicColGroupLabelWidth, d.yTextAxis.logicColGroupLabelWidth),
                maxTickLabelWidthAsPctOfChart: m(c.yTextAxis?.maxTickLabelWidthAsPctOfChart, g.yTextAxis?.maxTickLabelWidthAsPctOfChart, d.yTextAxis.maxTickLabelWidthAsPctOfChart),
                maxColGroupLabelWidthAsPctOfChart: m(c.yTextAxis?.maxColGroupLabelWidthAsPctOfChart, g.yTextAxis?.maxColGroupLabelWidthAsPctOfChart, d.yTextAxis.maxColGroupLabelWidthAsPctOfChart),
                colGroupGap: ms(sf, c.yTextAxis?.colGroupGap, g.yTextAxis?.colGroupGap, d.yTextAxis.colGroupGap),
                colGroupBracketGapLeft: ms(sf, c.yTextAxis?.colGroupBracketGapLeft, g.yTextAxis?.colGroupBracketGapLeft, d.yTextAxis.colGroupBracketGapLeft),
                colGroupBracketGapRight: ms(sf, c.yTextAxis?.colGroupBracketGapRight, g.yTextAxis?.colGroupBracketGapRight, d.yTextAxis.colGroupBracketGapRight),
                colGroupBracketPaddingY: ms(sf, c.yTextAxis?.colGroupBracketPaddingY, g.yTextAxis?.colGroupBracketPaddingY, d.yTextAxis.colGroupBracketPaddingY),
                colGroupBracketTickWidth: ms(sf, c.yTextAxis?.colGroupBracketTickWidth, g.yTextAxis?.colGroupBracketTickWidth, d.yTextAxis.colGroupBracketTickWidth),
                verticalColGroupLabels: m(c.yTextAxis?.verticalColGroupLabels, g.yTextAxis?.verticalColGroupLabels, d.yTextAxis.verticalColGroupLabels),
            },
            yScaleAxis: {
                max: m(c.yScaleAxis?.max, g.yScaleAxis?.max, d.yScaleAxis.max),
                min: m(c.yScaleAxis?.min, g.yScaleAxis?.min, d.yScaleAxis.min),
                showGrid: m(c.yScaleAxis?.showGrid, g.yScaleAxis?.showGrid, d.yScaleAxis.showGrid),
                labelGap: ms(sf, c.yScaleAxis?.labelGap, g.yScaleAxis?.labelGap, d.yScaleAxis.labelGap),
                tickWidth: ms(sf, c.yScaleAxis?.tickWidth, g.yScaleAxis?.tickWidth, d.yScaleAxis.tickWidth),
                tickLabelGap: ms(sf, c.yScaleAxis?.tickLabelGap, g.yScaleAxis?.tickLabelGap, d.yScaleAxis.tickLabelGap),
                tickLabelFormatter: m(c.yScaleAxis?.tickLabelFormatter, g.yScaleAxis?.tickLabelFormatter, d.yScaleAxis.tickLabelFormatter),
                forceTopOverhangHeight: getForceOverhand(sf, c.yScaleAxis?.forceTopOverhangHeight, g.yScaleAxis?.forceTopOverhangHeight, d.yScaleAxis.forceTopOverhangHeight),
            },
            textAxisTickLabelFormatter: m(c.textAxisTickLabelFormatter, g.textAxisTickLabelFormatter, d.textAxisTickLabelFormatter),
            dataLabelFormatter: m(c.dataLabelFormatter, g.dataLabelFormatter, d.dataLabelFormatter),
            dataLabelPositions: m(c.dataLabelPositions, g.dataLabelPositions, d.dataLabelPositions),
            arrowLabelFormatter: m(c.arrowLabelFormatter, g.arrowLabelFormatter, d.arrowLabelFormatter),
            axisStrokeWidth: ms(sf, c.axisStrokeWidth, g.axisStrokeWidth, d.axisStrokeWidth),
            gridStrokeWidth: ms(sf, c.gridStrokeWidth, g.gridStrokeWidth, d.gridStrokeWidth),
            colGroupBracketStrokeWidth: ms(sf, c.colGroupBracketStrokeWidth, g.colGroupBracketStrokeWidth, d.colGroupBracketStrokeWidth),
            //
            axisColor: getColor(m(c.axisColor, g.axisColor, d.axisColor)),
            gridColor: getColor(m(c.gridColor, g.gridColor, d.gridColor)),
            colGroupBracketColor: getColor(m(c.colGroupBracketColor, g.colGroupBracketColor, d.colGroupBracketColor)),
            backgroundColor: getColor(m(c.backgroundColor, g.backgroundColor, d.backgroundColor)),
            dataLabelGapXPoints: ms(sf, c.dataLabelGapXPoints, g.dataLabelGapXPoints, d.dataLabelGapXPoints),
            dataLabelGapYPoints: ms(sf, c.dataLabelGapYPoints, g.dataLabelGapYPoints, d.dataLabelGapYPoints),
            dataLabelGapXBars: ms(sf, c.dataLabelGapXBars, g.dataLabelGapXBars, d.dataLabelGapXBars),
            dataLabelGapYBars: ms(sf, c.dataLabelGapYBars, g.dataLabelGapYBars, d.dataLabelGapYBars),
            dataLabelOffsetXBars: ms(sf, c.dataLabelOffsetXBars, g.dataLabelOffsetXBars, d.dataLabelOffsetXBars),
            dataLabelPositionVerticalScale: m(c.dataLabelPositionVerticalScale, g.dataLabelPositionVerticalScale, d.dataLabelPositionVerticalScale),
            dataLabelPositionHorizontalScale: m(c.dataLabelPositionHorizontalScale, g.dataLabelPositionHorizontalScale, d.dataLabelPositionHorizontalScale),
            dataLabelPositionTwoWayScale: m(c.dataLabelPositionTwoWayScale, g.dataLabelPositionTwoWayScale, d.dataLabelPositionTwoWayScale),
            pctOfCol: m(c.pctOfCol, g.pctOfCol, d.pctOfCol),
            pctOfSeries: m(c.pctOfSeries, g.pctOfSeries, d.pctOfSeries),
            //
            barOpacity: m(c.barOpacity, g.barOpacity, d.barOpacity),
            pointRadius: ms(sf, c.pointRadius, g.pointRadius, d.pointRadius),
            pointStrokeWidth: ms(sf, c.pointStrokeWidth, g.pointStrokeWidth, d.pointStrokeWidth),
            pointInnerColorStrategy: m(c.pointInnerColorStrategy, g.pointInnerColorStrategy, d.pointInnerColorStrategy),
            errorBarColorStrategy: m(c.errorBarColorStrategy, g.errorBarColorStrategy, d.errorBarColorStrategy),
            errorBarWidthProportionOfPoint: m(c.errorBarWidthProportionOfPoint, g.errorBarWidthProportionOfPoint, d.errorBarWidthProportionOfPoint),
            errorBarWidthProportionOfBar: m(c.errorBarWidthProportionOfBar, g.errorBarWidthProportionOfBar, d.errorBarWidthProportionOfBar),
            //
            //
            arrowGap: ms(sf, c.arrowGap, g.arrowGap, d.arrowGap),
            arrowLength: ms(sf, c.arrowLength, g.arrowLength, d.arrowLength),
            arrowLabelGap: ms(sf, c.arrowLabelGap, g.arrowLabelGap, d.arrowLabelGap),
            arrowColor: getColor(m(c.arrowColor, g.arrowColor, d.arrowColor)),
            cascadeArrows: {
                showArrows: m(c.cascadeArrows?.showArrows, g.cascadeArrows?.showArrows, d.cascadeArrows.showArrows),
                arrowColor: getStyleFuncString(m(c.cascadeArrows?.arrowColor, g.cascadeArrows?.arrowColor, d.cascadeArrows.arrowColor)),
                arrowLabelFormatter: m(c.cascadeArrows?.arrowLabelFormatter, g.cascadeArrows?.arrowLabelFormatter, d.cascadeArrows.arrowLabelFormatter),
                arrowStrokeWidth: ms(sf, c.cascadeArrows?.arrowStrokeWidth, g.cascadeArrows?.arrowStrokeWidth, d.cascadeArrows.arrowStrokeWidth),
                arrowLengthPctOfSpace: m(c.cascadeArrows?.arrowLengthPctOfSpace, g.cascadeArrows?.arrowLengthPctOfSpace, d.cascadeArrows.arrowLengthPctOfSpace),
                arrowHeadLength: ms(sf, c.cascadeArrows?.arrowHeadLength, g.cascadeArrows?.arrowHeadLength, d.cascadeArrows.arrowHeadLength),
                arrowLabelGap: ms(sf, c.cascadeArrows?.arrowLabelGap, g.cascadeArrows?.arrowLabelGap, d.cascadeArrows.arrowLabelGap),
                upperLabels: m(c.cascadeArrows?.upperLabels, g.cascadeArrows?.upperLabels, d.cascadeArrows.upperLabels),
                upperLabelWidthPctOfCol: m(c.cascadeArrows?.upperLabelWidthPctOfCol, g.cascadeArrows?.upperLabelWidthPctOfCol, d.cascadeArrows.upperLabelWidthPctOfCol),
                upperLabelGapFromChartAreaY: ms(sf, c.cascadeArrows?.upperLabelGapFromChartAreaY, g.cascadeArrows?.upperLabelGapFromChartAreaY, d.cascadeArrows.upperLabelGapFromChartAreaY),
            },
            // Outline
            outlineOpacity: m(c.outlineOpacity, g.outlineOpacity, d.outlineOpacity),
            getOutlineOpacity: m(c.getOutlineOpacity, g.getOutlineOpacity, d.getOutlineOpacity),
            outlineType: m(c.outlineType, g.outlineType, d.outlineType),
            outlineRoundedRadius: ms(sf, c.outlineRoundedRadius, g.outlineRoundedRadius, d.outlineRoundedRadius),
            getOutlineWidth: m(c.getOutlineWidth, g.getOutlineWidth, d.getOutlineWidth),
        };
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //   ______                                                                     __            //
    //  /      \                                                                   /  |           //
    // /$$$$$$  | __    __   ______    ______    ______   __    __  _______    ____$$ |  _______  //
    // $$ \__$$/ /  |  /  | /      \  /      \  /      \ /  |  /  |/       \  /    $$ | /       | //
    // $$      \ $$ |  $$ |/$$$$$$  |/$$$$$$  |/$$$$$$  |$$ |  $$ |$$$$$$$  |/$$$$$$$ |/$$$$$$$/  //
    //  $$$$$$  |$$ |  $$ |$$ |  $$/ $$ |  $$/ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$      \  //
    // /  \__$$ |$$ \__$$ |$$ |      $$ |      $$ \__$$ |$$ \__$$ |$$ |  $$ |$$ \__$$ | $$$$$$  | //
    // $$    $$/ $$    $$/ $$ |      $$ |      $$    $$/ $$    $$/ $$ |  $$ |$$    $$ |/     $$/  //
    //  $$$$$$/   $$$$$$/  $$/       $$/        $$$$$$/   $$$$$$/  $$/   $$/  $$$$$$$/ $$$$$$$/   //
    //                                                                                            //
    ////////////////////////////////////////////////////////////////////////////////////////////////
    getMergedSurroundsStyle() {
        const sf = this._sf;
        const c = this._c ?? {};
        const g = this._g ?? {};
        const d = this._d;
        const baseText = this.baseText();
        return {
            padding: new Padding(m(c.padding, g.padding, d.padding)).toScaled(sf),
            text: {
                caption: getTextInfo(c.text?.caption, g.text?.caption, baseText),
                footnote: getTextInfo(c.text?.footnote, g.text?.footnote, baseText),
            },
            captionGap: ms(sf, c.captionGap, g.captionGap, d.captionGap),
            footnoteGap: ms(sf, c.footnoteGap, g.footnoteGap, d.footnoteGap),
            legendGap: ms(sf, c.legendGap, g.legendGap, d.legendGap),
            legendPosition: m(c.legend?.legendPosition, g.legend?.legendPosition, d.legend.legendPosition),
        };
    }
    //////////////////////////////////////////////////////////////////
    //  __                                                      __  //
    // /  |                                                    /  | //
    // $$ |        ______    ______    ______   _______    ____$$ | //
    // $$ |       /      \  /      \  /      \ /       \  /    $$ | //
    // $$ |      /$$$$$$  |/$$$$$$  |/$$$$$$  |$$$$$$$  |/$$$$$$$ | //
    // $$ |      $$    $$ |$$ |  $$ |$$    $$ |$$ |  $$ |$$ |  $$ | //
    // $$ |_____ $$$$$$$$/ $$ \__$$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ | //
    // $$       |$$       |$$    $$ |$$       |$$ |  $$ |$$    $$ | //
    // $$$$$$$$/  $$$$$$$/  $$$$$$$ | $$$$$$$/ $$/   $$/  $$$$$$$/  //
    //                     /  \__$$ |                               //
    //                     $$    $$/                                //
    //                      $$$$$$/                                 //
    //                                                              //
    //////////////////////////////////////////////////////////////////
    getMergedLegendStyle() {
        const sf = this._sf;
        const c = this._c ?? {};
        const g = this._g ?? {};
        const d = this._d;
        const baseText = this.baseText();
        return {
            text: getTextInfo(c.text?.legend, g.text?.legend, baseText),
            maxLegendItemsInOneColumn: m(c.legend?.maxLegendItemsInOneColumn, g.legend?.maxLegendItemsInOneColumn, d.legend.maxLegendItemsInOneColumn),
            legendColorBoxWidth: ms(sf, c.legend?.legendColorBoxWidth, g.legend?.legendColorBoxWidth, d.legend.legendColorBoxWidth),
            legendItemVerticalGap: ms(sf, c.legend?.legendItemVerticalGap, g.legend?.legendItemVerticalGap, d.legend.legendItemVerticalGap),
            legendLabelGap: ms(sf, c.legend?.legendLabelGap, g.legend?.legendLabelGap, d.legend.legendLabelGap),
            legendPointRadius: ms(sf, c.legend?.legendPointRadius, g.legend?.legendPointRadius, d.legend.legendPointRadius),
            legendPointStrokeWidth: ms(sf, c.legend?.legendPointStrokeWidth, g.legend?.legendPointStrokeWidth, d.legend.legendPointStrokeWidth),
            legendPointInnerColorStrategy: m(c.legend?.legendPointInnerColorStrategy, g.legend?.legendPointInnerColorStrategy, d.legend.legendPointInnerColorStrategy),
            reverseOrder: m(c.legend?.reverseOrder, g.legend?.reverseOrder, d.legend.reverseOrder),
        };
    }
    /////////////////////////////////////////////////////////////////////////////
    //  _______            __              __      __                          //
    // /       \          /  |            /  |    /  |                         //
    // $$$$$$$  | ______  $$ |  ______   _$$ |_  _$$ |_     ______    _______  //
    // $$ |__$$ |/      \ $$ | /      \ / $$   |/ $$   |   /      \  /       | //
    // $$    $$/ $$$$$$  |$$ |/$$$$$$  |$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$$/  //
    // $$$$$$$/  /    $$ |$$ |$$    $$ |  $$ | __ $$ | __ $$    $$ |$$      \  //
    // $$ |     /$$$$$$$ |$$ |$$$$$$$$/   $$ |/  |$$ |/  |$$$$$$$$/  $$$$$$  | //
    // $$ |     $$    $$ |$$ |$$       |  $$  $$/ $$  $$/ $$       |/     $$/  //
    // $$/       $$$$$$$/ $$/  $$$$$$$/    $$$$/   $$$$/   $$$$$$$/ $$$$$$$/   //
    //                                                                         //
    /////////////////////////////////////////////////////////////////////////////
    getMergedPaletteColorsStyle() {
        const c = this._c ?? {};
        const g = this._g ?? {};
        const d = this._d;
        return {
            logic: m(c.paletteColors?.logic, g.paletteColors?.logic, d.paletteColors.logic),
            single: m(c.paletteColors?.single, g.paletteColors?.single, d.paletteColors.single),
            specific: m(c.paletteColors?.specific, g.paletteColors?.specific, d.paletteColors.specific),
            auto: {
                first: m(c.paletteColors?.auto?.first, g.paletteColors?.auto?.first, d.paletteColors.auto.first),
                last: m(c.paletteColors?.auto?.last, g.paletteColors?.auto?.last, d.paletteColors.auto.last),
            },
            func: m(c.paletteColors?.func, g.paletteColors?.func, d.paletteColors.func),
        };
    }
    getMergedPalettePointStylesStyle() {
        const c = this._c ?? {};
        const g = this._g ?? {};
        const d = this._d;
        return {
            logic: m(c.palettePointStyles?.logic, g.palettePointStyles?.logic, d.palettePointStyles.logic),
            single: m(c.palettePointStyles?.single, g.palettePointStyles?.single, d.palettePointStyles.single),
            specific: m(c.palettePointStyles?.specific, g.palettePointStyles?.specific, d.palettePointStyles.specific),
            auto: m(c.palettePointStyles?.auto, g.palettePointStyles?.auto, d.palettePointStyles.auto),
        };
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //  __       __            __    __      __   ______   __                              __      //
    // /  \     /  |          /  |  /  |    /  | /      \ /  |                            /  |     //
    // $$  \   /$$ | __    __ $$ | _$$ |_   $$/ /$$$$$$  |$$ |____    ______    ______   _$$ |_    //
    // $$$  \ /$$$ |/  |  /  |$$ |/ $$   |  /  |$$ |  $$/ $$      \  /      \  /      \ / $$   |   //
    // $$$$  /$$$$ |$$ |  $$ |$$ |$$$$$$/   $$ |$$ |      $$$$$$$  | $$$$$$  |/$$$$$$  |$$$$$$/    //
    // $$ $$ $$/$$ |$$ |  $$ |$$ |  $$ | __ $$ |$$ |   __ $$ |  $$ | /    $$ |$$ |  $$/   $$ | __  //
    // $$ |$$$/ $$ |$$ \__$$ |$$ |  $$ |/  |$$ |$$ \__/  |$$ |  $$ |/$$$$$$$ |$$ |        $$ |/  | //
    // $$ | $/  $$ |$$    $$/ $$ |  $$  $$/ $$ |$$    $$/ $$ |  $$ |$$    $$ |$$ |        $$  $$/  //
    // $$/      $$/  $$$$$$/  $$/    $$$$/  $$/  $$$$$$/  $$/   $$/  $$$$$$$/ $$/          $$$$/   //
    //                                                                                             //
    /////////////////////////////////////////////////////////////////////////////////////////////////
    getMergedMultiContentStyle() {
        const sf = this._sf;
        const c = this._c ?? {};
        const g = this._g ?? {};
        const d = this._d;
        const baseText = this.baseText();
        return {
            alreadyScaledValue: sf,
            logicContentHeights: m(c.multiChart?.logicContentHeights, g.multiChart?.logicContentHeights, d.multiChart.logicContentHeights),
            padding: new Padding(m(c.padding, g.padding, d.padding)).toScaled(sf),
            backgroundColor: getColor(m(c.backgroundColor, g.backgroundColor, d.backgroundColor)),
            text: {
                subCaption: getTextInfo(c.text?.subCaption, g.text?.subCaption, baseText),
            },
            subChartGapX: ms(sf, c.multiChart?.subChartGapX, g.multiChart?.subChartGapX, d.multiChart.subChartGapX),
            subChartGapY: ms(sf, c.multiChart?.subChartGapY, g.multiChart?.subChartGapY, d.multiChart.subChartGapY),
            nPerRow: m(c.multiChart?.nPerRow, g.multiChart?.nPerRow, d.multiChart.nPerRow),
            nSlotsToSkip: m(c.multiChart?.nSlotsToSkip, g.multiChart?.nSlotsToSkip, d.multiChart.nSlotsToSkip),
            subCaptionGap: ms(sf, c.multiChart?.subCaptionGap, g.multiChart?.subCaptionGap, d.multiChart.subCaptionGap),
        };
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  ________                     __                       __                                                    __              __                          //
    // /        |                   /  |                     /  |                                                  /  |            /  |                         //
    // $$$$$$$$/______   _______   _$$ |_    _______        _$$ |_     ______          ______    ______    ______  $$/   _______  _$$ |_     ______    ______   //
    // $$ |__  /      \ /       \ / $$   |  /       |      / $$   |   /      \        /      \  /      \  /      \ /  | /       |/ $$   |   /      \  /      \  //
    // $$    |/$$$$$$  |$$$$$$$  |$$$$$$/  /$$$$$$$/       $$$$$$/   /$$$$$$  |      /$$$$$$  |/$$$$$$  |/$$$$$$  |$$ |/$$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$  | //
    // $$$$$/ $$ |  $$ |$$ |  $$ |  $$ | __$$      \         $$ | __ $$ |  $$ |      $$ |  $$/ $$    $$ |$$ |  $$ |$$ |$$      \   $$ | __ $$    $$ |$$ |  $$/  //
    // $$ |   $$ \__$$ |$$ |  $$ |  $$ |/  |$$$$$$  |        $$ |/  |$$ \__$$ |      $$ |      $$$$$$$$/ $$ \__$$ |$$ | $$$$$$  |  $$ |/  |$$$$$$$$/ $$ |       //
    // $$ |   $$    $$/ $$ |  $$ |  $$  $$//     $$/         $$  $$/ $$    $$/       $$ |      $$       |$$    $$ |$$ |/     $$/   $$  $$/ $$       |$$ |       //
    // $$/     $$$$$$/  $$/   $$/    $$$$/ $$$$$$$/           $$$$/   $$$$$$/        $$/        $$$$$$$/  $$$$$$$ |$$/ $$$$$$$/     $$$$/   $$$$$$$/ $$/        //
    //                                                                                                   /  \__$$ |                                             //
    //                                                                                                   $$    $$/                                              //
    //                                                                                                    $$$$$$/                                               //
    //                                                                                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getMergedChartFontsToRegister() {
        const d = this._d;
        const gText = this._g.text ?? {};
        const cText = this._c?.text ?? {};
        const baseFont = cText?.base?.font ?? gText?.base?.font ?? d.baseText.font;
        const notUnique = [
            getFont(baseFont),
            getMergedFont(cText?.xTextAxisTickLabels, gText?.xTextAxisTickLabels, baseFont),
            getMergedFont(cText?.xScaleAxisTickLabels, gText?.xScaleAxisTickLabels, baseFont),
            getMergedFont(cText?.xTextAxisLabel, gText?.xTextAxisLabel, baseFont),
            getMergedFont(cText?.xScaleAxisLabel, gText?.xScaleAxisLabel, baseFont),
            getMergedFont(cText?.yTextAxisTickLabels, gText?.yTextAxisTickLabels, baseFont),
            getMergedFont(cText?.yScaleAxisTickLabels, gText?.yScaleAxisTickLabels, baseFont),
            getMergedFont(cText?.yTextAxisLabel, gText?.yTextAxisLabel, baseFont),
            getMergedFont(cText?.yScaleAxisLabel, gText?.yScaleAxisLabel, baseFont),
            getMergedFont(cText?.colGroupLabels, gText?.colGroupLabels, baseFont),
            getMergedFont(cText?.dataLabels, gText?.dataLabels, baseFont),
            getMergedFont(cText?.arrowLabels, gText?.arrowLabels, baseFont),
            getMergedFont(cText?.cascadeArrowUpperLabels, gText?.cascadeArrowUpperLabels, baseFont),
            getMergedFont(cText?.legend, gText?.legend, baseFont),
            getMergedFont(cText?.sankeyLabels, gText?.sankeyLabels, baseFont),
            getMergedFont(cText?.caption, gText?.caption, baseFont),
            getMergedFont(cText?.footnote, gText?.footnote, baseFont),
            getMergedFont(cText?.subCaption, gText?.subCaption, baseFont),
        ];
        return notUnique
            .map((fi) => getFontInfoId(fi))
            .filter((fi, i, arr) => i === arr.indexOf(fi));
    }
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function getForceOverhand(sf, cFh, gFh, dFh) {
    const fh = m(cFh, gFh, dFh);
    if (fh === "none") {
        return "none";
    }
    return sf * fh;
}
function getTextInfo(cText, gText, baseText) {
    const rawColor = m(cText?.color, gText?.color, baseText.color);
    const rawLineHeight = m(cText?.lineHeight, gText?.lineHeight, baseText.lineHeight);
    return {
        font: getMergedFont(cText, gText, baseText.font),
        fontSize: baseText.fontSize * (cText?.relFontSize ?? gText?.relFontSize ?? 1),
        color: getColor(rawColor === "same-as-base" ? baseText.color : rawColor),
        lineHeight: rawLineHeight === "same-as-base" ? baseText.lineHeight : rawLineHeight,
    };
}
function getMergedFont(cText, gText, baseFont) {
    const rawFont = m(cText?.font, gText?.font, baseFont);
    return getFont(rawFont === "same-as-base" ? baseFont : rawFont);
}
function m(cs, gs, ds) {
    return cs ?? gs ?? ds;
}
function ms(sf, cs, gs, ds) {
    return sf * (cs ?? gs ?? ds);
}
