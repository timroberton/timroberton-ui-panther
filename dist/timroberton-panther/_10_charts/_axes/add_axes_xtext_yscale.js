import { getHeightOfUpperLabelBox } from "../_helpers/add_cascade_arrows.ts";
import { measureText, measureVerticalText, writeText, writeVerticalText, } from "../deps.ts";
import { getColGroupsExpandedFromDataColRow } from "./get_col_groups_expanded_from_data_colrow.ts";
import { getGoodAxisTickValuesFromMaxValue } from "./get_good_axis_tick_values.ts";
import { getColGroupLabelDimensions, getDataLabelDimensions, getDataLabelMaxWidthAndHeight, getMaxValueFromAoA, getVerticalXTextAxisTickLabelDimensions, getXTextAxisTickLabelDimensions, getYScaleAxisTickLabelDimensions, } from "./utils.ts";
export function addAxesXTextYScale(ctx, data, rpd, s, chartType, xAxisTicks) {
    const { x, y, w, h } = rpd.asObject();
    const { colGroups, showColGroupLabelsAndBracket } = getColGroupsExpandedFromDataColRow(data);
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    // Get initial widths
    const startingNTicks = 6;
    const maxDataValue = getMaxValueFromAoA(data.aoa, s.stacked === "stacked");
    const proposedMaxYAxisValue = s.yScaleAxis.max === "auto" ? maxDataValue : s.yScaleAxis.max;
    const proposedMinYAxisValue = s.yScaleAxis.min === "auto"
        ? (() => {
            throw new Error("Not yet implemented");
        })()
        : s.yScaleAxis.min;
    const yAxisTickValues = getGoodAxisTickValuesFromMaxValue(proposedMaxYAxisValue, proposedMinYAxisValue, startingNTicks, s.yScaleAxis.tickLabelFormatter);
    let yMax = yAxisTickValues.at(-1);
    const yMin = yAxisTickValues.at(0);
    let yAxisTickLabelDimensions = getYScaleAxisTickLabelDimensions(ctx, s, yAxisTickValues, Number.POSITIVE_INFINITY);
    const { w: yAxisTickLabelMaxWidth, h: yAxisTickLabelHeight } = yAxisTickLabelDimensions.at(-1).dims.asObject();
    const yAxisLabelX = x;
    let mYAxisLabel = undefined;
    let yAxisLabelAndGapWidth = 0;
    if (data.scaleAxisLabel?.trim()) {
        mYAxisLabel = measureVerticalText(ctx, data.scaleAxisLabel.trim(), s.text.yScaleAxisLabel, Number.POSITIVE_INFINITY);
        yAxisLabelAndGapWidth = mYAxisLabel.dims.w() + s.yScaleAxis.labelGap;
    }
    const yAxisTickLabelX = yAxisLabelX + yAxisLabelAndGapWidth;
    const yAxisTickLabelRight = yAxisTickLabelX + yAxisTickLabelMaxWidth;
    const yAxisTickX = yAxisTickLabelRight + s.yScaleAxis.tickLabelGap;
    const yAxisVerticalLineX = yAxisTickX + s.yScaleAxis.tickWidth;
    const chartAreaX = yAxisVerticalLineX + s.axisStrokeWidth;
    const yAxisAreaWidth = chartAreaX - x;
    const chartAreaWidth = w - yAxisAreaWidth;
    const chartAreaRight = chartAreaX + chartAreaWidth;
    const colGroupGapWithExtraGridLine = s.xTextAxis.colGroupGap === 0
        ? 0
        : s.xTextAxis.colGroupGap + s.gridStrokeWidth;
    const widthTakenUpByTextAxisPaddingColGroupGapsAndExtraGridLines = s.xTextAxis.paddingLeft +
        s.xTextAxis.paddingRight +
        (colGroups.length - 1) * colGroupGapWithExtraGridLine;
    const nColsForCalculatingWidths = colGroups.reduce((sum, cg) => sum + cg.cols.length, 0);
    const colAreaWidth = (chartAreaWidth -
        widthTakenUpByTextAxisPaddingColGroupGapsAndExtraGridLines) /
        nColsForCalculatingWidths -
        s.gridStrokeWidth;
    const xAxisLabelMaxWidth = colAreaWidth - 2 * s.xTextAxis.tickLabelPaddingX;
    const colGroupWidthsInsideBoundingGridLines = colGroups.map((cg) => {
        return (cg.cols.length * colAreaWidth + (cg.cols.length - 1) * s.gridStrokeWidth);
    });
    // Get initial heights
    const bottomY = y + h;
    let mXAxisLabel = undefined;
    let xAxisLabelAndGapHeight = 0;
    if (data.textAxisLabel?.trim()) {
        mXAxisLabel = measureText(ctx, data.textAxisLabel.trim(), s.text.xTextAxisLabel, Number.POSITIVE_INFINITY);
        xAxisLabelAndGapHeight = mXAxisLabel.dims.h() + s.xTextAxis.labelGap;
    }
    let verticalTickLabels = s.xTextAxis.verticalTickLabels;
    let xAxisTickLabelDimensions = verticalTickLabels
        ? getVerticalXTextAxisTickLabelDimensions(ctx, s, data.colHeaders, h * s.xTextAxis.maxVerticalTickLabelHeightAsPctOfChart)
        : getXTextAxisTickLabelDimensions(ctx, s, data.colHeaders, xAxisLabelMaxWidth);
    const xAxisTickLabelMaxWidth = Math.max(...xAxisTickLabelDimensions.map((d) => d.dims.w()));
    if (!verticalTickLabels && xAxisTickLabelMaxWidth > xAxisLabelMaxWidth) {
        verticalTickLabels = true;
        xAxisTickLabelDimensions = getVerticalXTextAxisTickLabelDimensions(ctx, s, data.colHeaders, h * s.xTextAxis.maxVerticalTickLabelHeightAsPctOfChart);
    }
    const xAxisTickLabelMaxHeight = Math.max(...xAxisTickLabelDimensions.map((d) => d.dims.h()));
    let colGroupLabelDimensions = [];
    let colGroupLabelY = bottomY - xAxisLabelAndGapHeight; // This gets updated
    let colGroupBracketY = colGroupLabelY;
    let xAxisTickLabelY = colGroupBracketY - xAxisTickLabelMaxHeight;
    if (showColGroupLabelsAndBracket) {
        colGroupLabelDimensions = getColGroupLabelDimensions(ctx, s, colGroups, colGroupWidthsInsideBoundingGridLines.map((cgw) => cgw - 2 * s.xTextAxis.colGroupLabelPaddingX));
        const colGroupLabelMaxHeight = Math.max(...colGroupLabelDimensions.map((d) => d?.dims.h() ?? 0));
        colGroupLabelY =
            bottomY - (xAxisLabelAndGapHeight + colGroupLabelMaxHeight);
        colGroupBracketY =
            colGroupLabelY -
                (s.xTextAxis.colGroupBracketGapBottom +
                    s.colGroupBracketStrokeWidth +
                    s.xTextAxis.colGroupBracketTickHeight);
        xAxisTickLabelY =
            colGroupBracketY -
                (xAxisTickLabelMaxHeight + s.xTextAxis.colGroupBracketGapTop);
    }
    const xAxisTicksAreCentred = xAxisTicks === "center";
    const xAxisTickHeightToAddToChartIfXAxisTicksAreCentred = xAxisTicksAreCentred
        ? s.xTextAxis.tickHeight
        : 0;
    const xAxisTickY = xAxisTickLabelY -
        (s.xTextAxis.tickLabelGap +
            xAxisTickHeightToAddToChartIfXAxisTicksAreCentred);
    const xAxisHorizontalLineY = xAxisTickY - s.axisStrokeWidth;
    const combinedHeightOfChartAndOverhang = xAxisHorizontalLineY - y;
    // Option 1 = (yAxis top label overhand is greater than dataLabel overhang)
    const chartAreaHeightOpt1 = combinedHeightOfChartAndOverhang -
        (yAxisTickLabelHeight - s.gridStrokeWidth) / 2;
    // Option 2 = (dataLabel overhang is greater)
    const dataLabelDimensions = getDataLabelDimensions(ctx, s, data);
    const { dataLabelMaxH } = getDataLabelMaxWidthAndHeight(dataLabelDimensions);
    const maxBarPct = maxDataValue / yMax;
    const additionalBarHeight = chartType === "point"
        ? Math.max(s.pointRadius + s.pointStrokeWidth, s.withDataLabels ? dataLabelMaxH / 2 : 0) -
            s.gridStrokeWidth / 2
        : s.withDataLabels
            ? s.dataLabelGapYBars + dataLabelMaxH
            : 0;
    const chartAreaHeightOpt2 = (combinedHeightOfChartAndOverhang - additionalBarHeight) / maxBarPct;
    ///////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// If upper labels ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    let chartAreaHeightOpt3 = Number.POSITIVE_INFINITY;
    if (s.cascadeArrows.upperLabels !== "none") {
        data.rowHeaders.forEach((_, i_row) => {
            let prevBarPct = -1;
            colGroups.forEach((colGroup, i_colGroup) => {
                colGroup.cols.forEach((cgc, i_colInColGroup) => {
                    const i_col = cgc.colIndexInAoA;
                    if (prevBarPct !== -1) {
                        const upperLabel = s.cascadeArrows.upperLabels(i_row, i_col, i_colGroup, i_colInColGroup);
                        if (upperLabel?.label !== undefined) {
                            const w = colAreaWidth * s.cascadeArrows.upperLabelWidthPctOfCol;
                            const additionalBarHeight = getHeightOfUpperLabelBox(ctx, upperLabel, w, s) +
                                s.cascadeArrows.upperLabelGapFromChartAreaY;
                            const newPossibleChartAreaHeightOpt3 = (combinedHeightOfChartAndOverhang - additionalBarHeight) /
                                prevBarPct;
                            chartAreaHeightOpt3 = Math.min(chartAreaHeightOpt3, newPossibleChartAreaHeightOpt3);
                        }
                    }
                    const cellPbe = data.aoa[i_row][i_col];
                    const barPct = cellPbe.pe / yMax;
                    prevBarPct = barPct;
                });
            });
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    const chartAreaHeight = s.yScaleAxis.forceTopOverhangHeight !== "none"
        ? combinedHeightOfChartAndOverhang - s.yScaleAxis.forceTopOverhangHeight
        : s.cascadeArrows.upperLabels !== "none"
            ? Math.min(chartAreaHeightOpt1, chartAreaHeightOpt2, chartAreaHeightOpt3)
            : Math.min(chartAreaHeightOpt1, chartAreaHeightOpt2);
    // const chartAreaHeight = Math.min(chartAreaHeightOpt1);
    const overhangHeight = combinedHeightOfChartAndOverhang - chartAreaHeight;
    const chartAreaY = y + overhangHeight;
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    // If needed, add more y Axis ticks, but keep same max value
    const maxNumberYTicks = Math.ceil((0.5 * chartAreaHeight) / yAxisTickLabelHeight);
    if (maxNumberYTicks > startingNTicks + 1) {
        const newYAxisTickValues = getGoodAxisTickValuesFromMaxValue(yAxisTickValues.at(-1) * 0.999, proposedMinYAxisValue, maxNumberYTicks, s.yScaleAxis.tickLabelFormatter);
        yMax = newYAxisTickValues.at(-1);
        yAxisTickLabelDimensions = getYScaleAxisTickLabelDimensions(ctx, s, newYAxisTickValues, Number.POSITIVE_INFINITY);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Render ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //  __      __                            __            //
    // /  \    /  |                          /  |           //
    // $$  \  /$$/         ______   __    __ $$/   _______  //
    //  $$  \/$$/         /      \ /  \  /  |/  | /       | //
    //   $$  $$/          $$$$$$  |$$  \/$$/ $$ |/$$$$$$$/  //
    //    $$$$/           /    $$ | $$  $$<  $$ |$$      \  //
    //     $$ |          /$$$$$$$ | /$$$$  \ $$ | $$$$$$  | //
    //     $$ |          $$    $$ |/$$/ $$  |$$ |/     $$/  //
    //     $$/            $$$$$$$/ $$/   $$/ $$/ $$$$$$$/   //
    //                                                      //
    //////////////////////////////////////////////////////////
    ctx.strokeStyle = s.axisColor;
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(yAxisVerticalLineX + s.axisStrokeWidth / 2, chartAreaY);
    ctx.lineTo(yAxisVerticalLineX + s.axisStrokeWidth / 2, xAxisHorizontalLineY);
    ctx.stroke();
    if (data.scaleAxisLabel?.trim() && mYAxisLabel) {
        writeVerticalText(ctx, mYAxisLabel, yAxisLabelX, chartAreaY + chartAreaHeight / 2, "center", "left", "anticlockwise");
    }
    // Y axis ticks
    const topTickY = chartAreaY;
    const bottomTickY = xAxisHorizontalLineY;
    const yAxisTicksHeightBetween = (bottomTickY - topTickY) / (yAxisTickLabelDimensions.length - 1);
    let yTickLabelsCurrentY = bottomTickY;
    yAxisTickLabelDimensions.forEach((m, i_tick) => {
        const tickStrokeWidth = i_tick > 0 ? s.gridStrokeWidth : s.axisStrokeWidth;
        // Labels
        writeText(ctx, m, yAxisTickLabelRight, yTickLabelsCurrentY + tickStrokeWidth / 2 - m.dims.h() / 2, "right");
        // Ticks
        ctx.strokeStyle = s.axisColor;
        ctx.lineWidth = tickStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(yAxisTickX, yTickLabelsCurrentY + tickStrokeWidth / 2);
        ctx.lineTo(yAxisVerticalLineX, yTickLabelsCurrentY + tickStrokeWidth / 2);
        ctx.stroke();
        // Grid lines
        if (s.yScaleAxis.showGrid && i_tick > 0) {
            ctx.strokeStyle = s.gridColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(chartAreaX, yTickLabelsCurrentY + s.gridStrokeWidth / 2);
            ctx.lineTo(chartAreaRight, yTickLabelsCurrentY + s.gridStrokeWidth / 2);
            ctx.stroke();
        }
        yTickLabelsCurrentY -= yAxisTicksHeightBetween;
    });
    ////////////////////////////////////////////////////////
    //  __    __                            __            //
    // /  |  /  |                          /  |           //
    // $$ |  $$ |        ______   __    __ $$/   _______  //
    // $$  \/$$/        /      \ /  \  /  |/  | /       | //
    //  $$  $$<         $$$$$$  |$$  \/$$/ $$ |/$$$$$$$/  //
    //   $$$$  \        /    $$ | $$  $$<  $$ |$$      \  //
    //  $$ /$$  |      /$$$$$$$ | /$$$$  \ $$ | $$$$$$  | //
    // $$ |  $$ |      $$    $$ |/$$/ $$  |$$ |/     $$/  //
    // $$/   $$/        $$$$$$$/ $$/   $$/ $$/ $$$$$$$/   //
    //                                                    //
    ////////////////////////////////////////////////////////
    // X axis main horizontal line
    ctx.strokeStyle = s.axisColor;
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(yAxisVerticalLineX, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.lineTo(chartAreaRight, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.stroke();
    if (data.textAxisLabel?.trim() && mXAxisLabel) {
        writeText(ctx, mXAxisLabel, yAxisVerticalLineX + chartAreaWidth / 2, bottomY - mXAxisLabel.dims.h(), "center");
    }
    if (!xAxisTicksAreCentred) {
        // X axis first tick on far left
        const tickCX = yAxisVerticalLineX + s.xTextAxis.paddingLeft + s.axisStrokeWidth / 2;
        ctx.strokeStyle = s.axisColor;
        ctx.lineWidth = s.axisStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(tickCX, xAxisTickY);
        ctx.lineTo(tickCX, xAxisTickY + s.xTextAxis.tickHeight);
        ctx.stroke();
        // Extra grid line on far left if there is any textAxisPaddingStart
        if (s.xTextAxis.showGrid && s.xTextAxis.paddingLeft > 0) {
            ctx.strokeStyle = s.gridColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(tickCX, chartAreaY);
            ctx.lineTo(tickCX, xAxisHorizontalLineY);
            ctx.stroke();
        }
    }
    // Extra grid line on far right if there is any textAxisPaddingEnd or if ticks are centered
    if ((s.xTextAxis.showGrid &&
        (xAxisTicksAreCentred || s.xTextAxis.paddingRight > 0)) ||
        !s.xTextAxis.showGrid) {
        ctx.strokeStyle = s.gridColor;
        ctx.lineWidth = s.gridStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(chartAreaRight - s.gridStrokeWidth / 2, chartAreaY);
        ctx.lineTo(chartAreaRight - s.gridStrokeWidth / 2, xAxisHorizontalLineY);
        ctx.stroke();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  ______  __                                                    __   ______                                           //
    // /      |/  |                                                  /  | /      \                                          //
    // $$$$$$/_$$ |_     ______    ______          _______   ______  $$ |/$$$$$$  |  ______    ______   __    __   ______   //
    //   $$ |/ $$   |   /      \  /      \        /       | /      \ $$ |$$ | _$$/  /      \  /      \ /  |  /  | /      \  //
    //   $$ |$$$$$$/   /$$$$$$  |/$$$$$$  |      /$$$$$$$/ /$$$$$$  |$$ |$$ |/    |/$$$$$$  |/$$$$$$  |$$ |  $$ |/$$$$$$  | //
    //   $$ |  $$ | __ $$    $$ |$$ |  $$/       $$ |      $$ |  $$ |$$ |$$ |$$$$ |$$ |  $$/ $$ |  $$ |$$ |  $$ |$$ |  $$ | //
    //  _$$ |_ $$ |/  |$$$$$$$$/ $$ |            $$ \_____ $$ \__$$ |$$ |$$ \__$$ |$$ |      $$ \__$$ |$$ \__$$ |$$ |__$$ | //
    // / $$   |$$  $$/ $$       |$$ |            $$       |$$    $$/ $$ |$$    $$/ $$ |      $$    $$/ $$    $$/ $$    $$/  //
    // $$$$$$/  $$$$/   $$$$$$$/ $$/              $$$$$$$/  $$$$$$/  $$/  $$$$$$/  $$/        $$$$$$/   $$$$$$/  $$$$$$$/   //
    //                                                                                                           $$ |       //
    //                                                                                                           $$ |       //
    //                                                                                                           $$/        //
    //                                                                                                                      //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Iterate throw all cols
    let colBarCurrentX = chartAreaX + s.xTextAxis.paddingLeft;
    // Iterate within col groups NOTE!!! These may get overridden if not joining across colGroups
    colGroups.forEach((colGroup, i_colGroup) => {
        if (i_colGroup > 0 && s.xTextAxis.colGroupGap > 0) {
            if (!xAxisTicksAreCentred) {
                // Extra tick for col group gap
                const tickCX = colBarCurrentX + s.xTextAxis.colGroupGap + s.gridStrokeWidth / 2;
                ctx.strokeStyle = s.axisColor;
                ctx.lineWidth = s.gridStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(tickCX, xAxisTickY);
                ctx.lineTo(tickCX, xAxisTickY + s.xTextAxis.tickHeight);
                ctx.stroke();
                // Extra grid line for col group gap
                if (s.xTextAxis.showGrid) {
                    ctx.strokeStyle = s.gridColor;
                    ctx.lineWidth = s.gridStrokeWidth;
                    ctx.beginPath();
                    ctx.moveTo(tickCX, chartAreaY);
                    ctx.lineTo(tickCX, xAxisHorizontalLineY);
                    ctx.stroke();
                }
            }
            colBarCurrentX += s.xTextAxis.colGroupGap + s.gridStrokeWidth;
        }
        // Col group labels
        if (showColGroupLabelsAndBracket) {
            const colGroupWidth = colGroupWidthsInsideBoundingGridLines[i_colGroup];
            // Labels
            const mColGroupLabel = colGroupLabelDimensions[i_colGroup];
            if (mColGroupLabel) {
                writeText(ctx, mColGroupLabel, colBarCurrentX + colGroupWidth / 2, colGroupLabelY, "center");
                // Bracket
                ctx.strokeStyle = s.colGroupBracketColor;
                ctx.lineWidth = s.colGroupBracketStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(colBarCurrentX +
                    s.xTextAxis.colGroupBracketPaddingX -
                    s.colGroupBracketStrokeWidth / 2, colGroupBracketY);
                ctx.lineTo(colBarCurrentX +
                    s.xTextAxis.colGroupBracketPaddingX -
                    s.colGroupBracketStrokeWidth / 2, colGroupBracketY +
                    s.xTextAxis.colGroupBracketTickHeight +
                    s.colGroupBracketStrokeWidth / 2);
                ctx.lineTo(colBarCurrentX +
                    colGroupWidth -
                    s.xTextAxis.colGroupBracketPaddingX +
                    s.colGroupBracketStrokeWidth / 2, colGroupBracketY +
                    s.xTextAxis.colGroupBracketTickHeight +
                    s.colGroupBracketStrokeWidth / 2);
                ctx.lineTo(colBarCurrentX +
                    colGroupWidth -
                    s.xTextAxis.colGroupBracketPaddingX +
                    s.colGroupBracketStrokeWidth / 2, colGroupBracketY);
                ctx.stroke();
            }
        }
        //////////////////////////////////////////////////////////////////////
        //  __    __                                                    __  //
        // /  |  /  |                                                  /  | //
        // $$/  _$$ |_     ______    ______          _______   ______  $$ | //
        // /  |/ $$   |   /      \  /      \        /       | /      \ $$ | //
        // $$ |$$$$$$/   /$$$$$$  |/$$$$$$  |      /$$$$$$$/ /$$$$$$  |$$ | //
        // $$ |  $$ | __ $$    $$ |$$ |  $$/       $$ |      $$ |  $$ |$$ | //
        // $$ |  $$ |/  |$$$$$$$$/ $$ |            $$ \_____ $$ \__$$ |$$ | //
        // $$ |  $$  $$/ $$       |$$ |            $$       |$$    $$/ $$ | //
        // $$/    $$$$/   $$$$$$$/ $$/              $$$$$$$/  $$$$$$/  $$/  //
        //                                                                  //
        //////////////////////////////////////////////////////////////////////
        colGroup.cols.forEach((cgc) => {
            const i_col = cgc.colIndexInAoA;
            const mXAxisTickLabel = xAxisTickLabelDimensions[i_col];
            // Labels
            // ctx.fillStyle = "red";
            // ctx.fillRect(
            //   colBarCurrentX + (colAreaWidth - mXAxisTickLabel.width) / 2,
            //   xAxisTickLabelY,
            //   10,
            //   10
            // );
            if (verticalTickLabels) {
                writeVerticalText(ctx, mXAxisTickLabel, colBarCurrentX + colAreaWidth / 2, xAxisTickLabelY, "top", "center", "anticlockwise");
            }
            else {
                writeText(ctx, mXAxisTickLabel, colBarCurrentX + colAreaWidth / 2, xAxisTickLabelY, "center");
            }
            const tickX = xAxisTicksAreCentred
                ? colBarCurrentX + colAreaWidth / 2
                : colBarCurrentX + colAreaWidth + s.gridStrokeWidth / 2;
            // Ticks
            ctx.strokeStyle = s.axisColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(tickX, xAxisTickY);
            ctx.lineTo(tickX, xAxisTickY + s.xTextAxis.tickHeight);
            ctx.stroke();
            // Grid
            if (s.xTextAxis.showGrid) {
                ctx.strokeStyle = s.gridColor;
                ctx.lineWidth = s.gridStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(tickX, chartAreaY);
                ctx.lineTo(tickX, xAxisHorizontalLineY);
                ctx.stroke();
            }
            cgc.coords.x = colBarCurrentX;
            cgc.coords.cx = colBarCurrentX + colAreaWidth / 2;
            cgc.coords.y = chartAreaY;
            cgc.coords.cy = chartAreaY + chartAreaHeight / 2;
            cgc.coords.w = colAreaWidth;
            cgc.coords.h = chartAreaHeight;
            colBarCurrentX += colAreaWidth + s.gridStrokeWidth;
        });
    });
    return {
        colGroups: colGroups,
        yMax,
        yMin,
        dataLabelDimensions,
    };
}
