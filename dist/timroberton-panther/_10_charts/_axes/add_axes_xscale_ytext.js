import { getColHeight } from "../_helpers/get_col_height";
import { avg, measureText, measureVerticalText, writeText, writeVerticalText, } from "../deps";
import { getColGroupsExpandedFromDataColRow } from "./get_col_groups_expanded_from_data_colrow";
import { getGoodAxisTickValuesFromMaxValue } from "./get_good_axis_tick_values";
import { getColGroupLabelDimensions, getDataLabelDimensions, getDataLabelMaxWidthAndHeight, getMaxValueFromAoA, getVerticalColGroupLabelDimensions, getXScaleAxisTickLabelDimensions, getYTextAxisTickLabelDimensions, } from "./utils";
export function addAxesXScaleYText(ctx, data, rpd, s, chartType, yAxisTicks) {
    const { x, y, w, h } = rpd.asObject();
    const { colGroups, showColGroupLabelsAndBracket } = getColGroupsExpandedFromDataColRow(data);
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    // Get initial widths
    const startingNTicks = 6;
    // data.aoa[0].forEach((_, i_col) => {
    //   console.log(sum(data.aoa.map((row) => row[i_col])));
    // });
    const maxValue = s.xScaleAxis.max === "auto"
        ? getMaxValueFromAoA(data.aoa, s.stacked === "stacked")
        : s.xScaleAxis.max;
    const minXValue = s.xScaleAxis.min === "auto"
        ? (() => {
            throw new Error("Not yet implemented");
        })()
        : s.xScaleAxis.min;
    const xAxisTickValues = getGoodAxisTickValuesFromMaxValue(maxValue, minXValue, startingNTicks, s.xScaleAxis.tickLabelFormatter);
    let xMax = xAxisTickValues.at(-1);
    const xMin = xAxisTickValues.at(0);
    let xAxisTickLabelDimensions = getXScaleAxisTickLabelDimensions(ctx, s, xAxisTickValues, Number.POSITIVE_INFINITY);
    const { w: xAxisTickLabelMaxWidth, h: xAxisTickLabelHeight } = xAxisTickLabelDimensions.at(-1).dims.asObject();
    const bottomY = y + h;
    let mXAxisLabel = undefined;
    let xAxisLabelAndGapHeight = 0;
    if (data.scaleAxisLabel?.trim()) {
        mXAxisLabel = measureText(ctx, data.scaleAxisLabel.trim(), s.text.xScaleAxisLabel, Number.POSITIVE_INFINITY);
        xAxisLabelAndGapHeight = mXAxisLabel.dims.h() + s.xScaleAxis.labelGap;
    }
    const xAxisTickLabelY = bottomY - (xAxisLabelAndGapHeight + xAxisTickLabelHeight);
    const xAxisTickY = xAxisTickLabelY - (s.xScaleAxis.tickLabelGap + s.xScaleAxis.tickHeight);
    const xAxisHorizontalLineY = xAxisTickY - s.axisStrokeWidth;
    const chartAreaHeight = xAxisHorizontalLineY - y;
    // DONE TO HERE
    const colGroupGapWithExtraGridLine = s.yTextAxis.colGroupGap === 0
        ? 0
        : s.yTextAxis.colGroupGap + s.gridStrokeWidth;
    const heightTakenUpByTextAxisPaddingColGroupGapsAndExtraGridLines = s.yTextAxis.paddingTop +
        s.yTextAxis.paddingBottom +
        (colGroups.length - 1) * colGroupGapWithExtraGridLine;
    const nColsForCalculatingHeights = colGroups.reduce((sum, cg) => sum + cg.cols.length, 0);
    const colAreaHeight = (chartAreaHeight -
        heightTakenUpByTextAxisPaddingColGroupGapsAndExtraGridLines) /
        nColsForCalculatingHeights -
        s.gridStrokeWidth;
    // Get initial heights
    const yAxisLabelX = x;
    let mYAxisLabel = undefined;
    let yAxisLabelAndGapWidth = 0;
    if (data.textAxisLabel?.trim()) {
        mYAxisLabel = measureVerticalText(ctx, data.textAxisLabel.trim(), s.text.yTextAxisLabel, Number.POSITIVE_INFINITY);
        yAxisLabelAndGapWidth = mYAxisLabel.dims.w() + s.yTextAxis.labelGap;
    }
    const yAxisTickLabelDimensions = getYTextAxisTickLabelDimensions(ctx, s, data.colHeaders, w * s.yTextAxis.maxTickLabelWidthAsPctOfChart);
    const yAxisTickLabelMaxWidth = s.yTextAxis.logicTickLabelWidth === "auto"
        ? Math.max(...yAxisTickLabelDimensions.map((d) => d.dims.w()))
        : w * s.yTextAxis.maxTickLabelWidthAsPctOfChart;
    let colGroupLabelDimensions = [];
    const colGroupLabelX = yAxisLabelX + yAxisLabelAndGapWidth;
    let colGroupLabelRight = colGroupLabelX;
    let colGroupBracketX = colGroupLabelX;
    let yAxisTickLabelX = colGroupLabelX;
    const colGroupHeightsInsideBoundingGridLines = colGroups.map((cg) => {
        return (cg.cols.length * colAreaHeight + (cg.cols.length - 1) * s.gridStrokeWidth);
    });
    if (showColGroupLabelsAndBracket) {
        colGroupLabelDimensions = s.yTextAxis.verticalColGroupLabels
            ? getVerticalColGroupLabelDimensions(ctx, s, colGroups, colGroups.map((colGroup) => {
                const nRows = chartType === "point" || s.stacked === "stacked"
                    ? 1
                    : data.rowHeaders.length;
                return getColHeight(colGroup, nRows, s);
            }))
            : getColGroupLabelDimensions(ctx, s, colGroups, colGroups.map((_) => w * s.yTextAxis.maxColGroupLabelWidthAsPctOfChart));
        const colGroupLabelMaxWidth = s.yTextAxis.logicColGroupLabelWidth === "auto"
            ? Math.max(...colGroupLabelDimensions.map((d) => d?.dims.w() ?? 0))
            : w * s.yTextAxis.maxColGroupLabelWidthAsPctOfChart;
        colGroupLabelRight = colGroupLabelX + colGroupLabelMaxWidth;
        colGroupBracketX = colGroupLabelRight + s.yTextAxis.colGroupBracketGapLeft;
        yAxisTickLabelX =
            colGroupBracketX +
                s.colGroupBracketStrokeWidth +
                s.yTextAxis.colGroupBracketTickWidth +
                s.yTextAxis.colGroupBracketGapRight;
    }
    const yAxisTicksAreCentred = yAxisTicks === "center";
    const yAxisTickWidthToAddToChartIfYAxisTicksAreCentred = yAxisTicksAreCentred
        ? s.yTextAxis.tickWidth
        : 0;
    const yAxisVerticalLineX = yAxisTickLabelX +
        yAxisTickLabelMaxWidth +
        s.yTextAxis.tickLabelGap +
        yAxisTickWidthToAddToChartIfYAxisTicksAreCentred;
    const yAxisTickX = yAxisVerticalLineX - s.yTextAxis.tickWidth;
    const chartAreaX = yAxisVerticalLineX + s.axisStrokeWidth;
    const yAxisAreaWidth = chartAreaX - x;
    const chartAreaY = y;
    const combinedWidthOfChartAndOverhang = w - yAxisAreaWidth;
    // Option 1 = (yAxis top label overhand is greater than dataLabel overhang)
    const chartAreaWidthOpt1 = combinedWidthOfChartAndOverhang -
        (xAxisTickLabelMaxWidth - s.gridStrokeWidth) / 2;
    // Option 2 = (dataLabel overhang is greater)
    const dataLabelDimensions = getDataLabelDimensions(ctx, s, data);
    const { dataLabelMaxW } = getDataLabelMaxWidthAndHeight(dataLabelDimensions);
    const maxBarPct = maxValue / xMax;
    const additionalBarWidth = chartType === "point"
        ? Math.max(s.pointRadius + s.pointStrokeWidth, s.withDataLabels ? dataLabelMaxW / 2 : 0) -
            s.gridStrokeWidth / 2
        : s.withDataLabels
            ? s.dataLabelGapXBars + dataLabelMaxW
            : 0;
    const chartAreaWidthOpt2 = (combinedWidthOfChartAndOverhang - additionalBarWidth) / maxBarPct;
    const chartAreaWidth = Math.min(chartAreaWidthOpt1, chartAreaWidthOpt2);
    const chartAreaRight = chartAreaX + chartAreaWidth;
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    // If needed, add more x Axis ticks, but keep same max value
    const avgTickLabelWidth = avg(xAxisTickLabelDimensions.map((tl) => tl.dims.w()));
    const maxNumberXTicks = Math.ceil((0.5 * chartAreaWidth) / avgTickLabelWidth);
    if (maxNumberXTicks > startingNTicks + 1) {
        const newXAxisTickValues = getGoodAxisTickValuesFromMaxValue(xAxisTickValues.at(-1) * 0.999, minXValue, maxNumberXTicks, s.xScaleAxis.tickLabelFormatter);
        xMax = newXAxisTickValues.at(-1);
        xAxisTickLabelDimensions = getXScaleAxisTickLabelDimensions(ctx, s, newXAxisTickValues, Number.POSITIVE_INFINITY);
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Render ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
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
    ctx.strokeStyle = s.axisColor;
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(chartAreaX, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.lineTo(chartAreaRight, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.stroke();
    if (data.scaleAxisLabel?.trim() && mXAxisLabel) {
        writeText(ctx, mXAxisLabel, yAxisVerticalLineX + chartAreaWidth / 2, bottomY - mXAxisLabel.dims.h(), "center");
    }
    // X axis ticks
    const leftTickX = chartAreaX - s.axisStrokeWidth / 2;
    const rightTickX = chartAreaRight - s.gridStrokeWidth / 2;
    const xAxisTicksWidthBetween = (rightTickX - leftTickX) / (xAxisTickLabelDimensions.length - 1);
    let xTickLabelsCurrentX = leftTickX;
    xAxisTickLabelDimensions.forEach((m, i_tick) => {
        const tickStrokeWidth = i_tick > 0 ? s.gridStrokeWidth : s.axisStrokeWidth;
        // Labels
        writeText(ctx, m, xTickLabelsCurrentX, xAxisTickLabelY, "center");
        // Ticks
        ctx.strokeStyle = s.axisColor;
        ctx.lineWidth = tickStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(xTickLabelsCurrentX, xAxisTickY);
        ctx.lineTo(xTickLabelsCurrentX, xAxisTickY + s.xScaleAxis.tickHeight);
        ctx.stroke();
        // Grid lines
        if (s.xScaleAxis.showGrid && i_tick > 0) {
            ctx.strokeStyle = s.gridColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(xTickLabelsCurrentX, chartAreaY);
            ctx.lineTo(xTickLabelsCurrentX, chartAreaY + chartAreaHeight);
            ctx.stroke();
        }
        xTickLabelsCurrentX += xAxisTicksWidthBetween;
    });
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
    // Y axis main horizontal line
    ctx.strokeStyle = s.axisColor;
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(yAxisVerticalLineX + s.axisStrokeWidth / 2, chartAreaY);
    ctx.lineTo(yAxisVerticalLineX + s.axisStrokeWidth / 2, xAxisHorizontalLineY + s.axisStrokeWidth);
    ctx.stroke();
    if (data.textAxisLabel?.trim() && mYAxisLabel) {
        writeVerticalText(ctx, mYAxisLabel, yAxisLabelX, chartAreaY + chartAreaHeight / 2, "center", "left", "anticlockwise");
    }
    if (!yAxisTicksAreCentred) {
        // Y axis last tick on far bottom
        const tickCY = xAxisHorizontalLineY + s.axisStrokeWidth / 2 - s.yTextAxis.paddingBottom;
        ctx.strokeStyle = s.axisColor;
        ctx.lineWidth = s.axisStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(yAxisTickX, tickCY);
        ctx.lineTo(yAxisVerticalLineX, tickCY);
        ctx.stroke();
        // Extra grid line on far bottom if there is any yTextAxis.paddingBottom
        if (s.yTextAxis.showGrid && s.yTextAxis.paddingBottom > 0) {
            ctx.strokeStyle = s.gridColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(chartAreaX, tickCY);
            ctx.lineTo(chartAreaRight, tickCY);
            ctx.stroke();
        }
    }
    // Extra grid line on far top if there is any yTextAxis.paddingTop or if ticks are centered
    if ((s.yTextAxis.showGrid &&
        (yAxisTicksAreCentred || s.yTextAxis.paddingTop > 0)) ||
        !s.yTextAxis.showGrid) {
        ctx.strokeStyle = s.gridColor;
        ctx.lineWidth = s.gridStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(chartAreaX, chartAreaY + s.gridStrokeWidth / 2);
        ctx.lineTo(chartAreaRight, chartAreaY + s.gridStrokeWidth / 2);
        ctx.stroke();
    }
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //  ______  __                                                    __   ______                                           //
    // // /      |/  |                                                  /  | /      \                                          //
    // // $$$$$$/_$$ |_     ______    ______          _______   ______  $$ |/$$$$$$  |  ______    ______   __    __   ______   //
    // //   $$ |/ $$   |   /      \  /      \        /       | /      \ $$ |$$ | _$$/  /      \  /      \ /  |  /  | /      \  //
    // //   $$ |$$$$$$/   /$$$$$$  |/$$$$$$  |      /$$$$$$$/ /$$$$$$  |$$ |$$ |/    |/$$$$$$  |/$$$$$$  |$$ |  $$ |/$$$$$$  | //
    // //   $$ |  $$ | __ $$    $$ |$$ |  $$/       $$ |      $$ |  $$ |$$ |$$ |$$$$ |$$ |  $$/ $$ |  $$ |$$ |  $$ |$$ |  $$ | //
    // //  _$$ |_ $$ |/  |$$$$$$$$/ $$ |            $$ \_____ $$ \__$$ |$$ |$$ \__$$ |$$ |      $$ \__$$ |$$ \__$$ |$$ |__$$ | //
    // // / $$   |$$  $$/ $$       |$$ |            $$       |$$    $$/ $$ |$$    $$/ $$ |      $$    $$/ $$    $$/ $$    $$/  //
    // // $$$$$$/  $$$$/   $$$$$$$/ $$/              $$$$$$$/  $$$$$$/  $$/  $$$$$$/  $$/        $$$$$$/   $$$$$$/  $$$$$$$/   //
    // //                                                                                                           $$ |       //
    // //                                                                                                           $$ |       //
    // //                                                                                                           $$/        //
    // //                                                                                                                      //
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Iterate throw all cols, from top to bottom
    let colBarCurrentY = chartAreaY + s.gridStrokeWidth + s.yTextAxis.paddingTop;
    colGroups.forEach((colGroup, i_colGroup) => {
        // Col group labels
        if (showColGroupLabelsAndBracket) {
            const colGroupHeight = colGroupHeightsInsideBoundingGridLines[i_colGroup];
            // // Labels
            const mColGroupLabel = colGroupLabelDimensions[i_colGroup];
            if (mColGroupLabel) {
                if (s.yTextAxis.verticalColGroupLabels) {
                    writeVerticalText(ctx, mColGroupLabel, colGroupLabelRight, colBarCurrentY + colGroupHeight / 2, "center", "right", "anticlockwise");
                }
                else {
                    writeText(ctx, mColGroupLabel, colGroupLabelRight, colBarCurrentY + (colGroupHeight - mColGroupLabel.dims.h()) / 2, "right");
                }
                // Bracket
                ctx.strokeStyle = s.colGroupBracketColor;
                ctx.lineWidth = s.colGroupBracketStrokeWidth;
                const colGroupBracketCX = colGroupBracketX + s.colGroupBracketStrokeWidth / 2;
                ctx.beginPath();
                ctx.moveTo(colGroupBracketX + s.yTextAxis.colGroupBracketTickWidth, colBarCurrentY +
                    s.yTextAxis.colGroupBracketPaddingY -
                    s.colGroupBracketStrokeWidth / 2);
                ctx.lineTo(colGroupBracketCX, colBarCurrentY +
                    s.yTextAxis.colGroupBracketPaddingY -
                    s.colGroupBracketStrokeWidth / 2);
                ctx.lineTo(colGroupBracketCX, colBarCurrentY +
                    colGroupHeight +
                    s.colGroupBracketStrokeWidth / 2 -
                    s.yTextAxis.colGroupBracketPaddingY);
                ctx.lineTo(colGroupBracketX + s.yTextAxis.colGroupBracketTickWidth, colBarCurrentY +
                    colGroupHeight +
                    s.colGroupBracketStrokeWidth / 2 -
                    s.yTextAxis.colGroupBracketPaddingY);
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
            const mYAxisTickLabel = yAxisTickLabelDimensions[i_col];
            // Labels
            writeText(ctx, mYAxisTickLabel, yAxisTickLabelX + yAxisTickLabelMaxWidth, colBarCurrentY + (colAreaHeight - mYAxisTickLabel.dims.h()) / 2, "right");
            const tickCY = yAxisTicksAreCentred
                ? colBarCurrentY + colAreaHeight / 2
                : colBarCurrentY - s.gridStrokeWidth / 2;
            // Ticks
            ctx.strokeStyle = s.axisColor;
            ctx.lineWidth = s.gridStrokeWidth;
            ctx.beginPath();
            ctx.moveTo(yAxisTickX, tickCY);
            ctx.lineTo(yAxisTickX + s.yTextAxis.tickWidth, tickCY);
            ctx.stroke();
            // Grid
            if (s.yTextAxis.showGrid) {
                ctx.strokeStyle = s.gridColor;
                ctx.lineWidth = s.gridStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(chartAreaX, tickCY);
                ctx.lineTo(chartAreaRight, tickCY);
                ctx.stroke();
            }
            cgc.coords.x = chartAreaX;
            cgc.coords.cx = chartAreaX + chartAreaWidth / 2;
            cgc.coords.y = colBarCurrentY;
            cgc.coords.cy = colBarCurrentY + colAreaHeight / 2;
            cgc.coords.w = chartAreaWidth;
            cgc.coords.h = colAreaHeight;
            colBarCurrentY += colAreaHeight + s.gridStrokeWidth;
        });
        if (i_colGroup < colGroups.length - 1 && s.yTextAxis.colGroupGap > 0) {
            if (!yAxisTicksAreCentred) {
                // Extra tick for col group gap
                const tickCY = colBarCurrentY - s.gridStrokeWidth / 2;
                ctx.strokeStyle = s.axisColor;
                ctx.lineWidth = s.gridStrokeWidth;
                ctx.beginPath();
                ctx.moveTo(yAxisTickX, tickCY);
                ctx.lineTo(yAxisTickX + s.yTextAxis.tickWidth, tickCY);
                ctx.stroke();
                // Extra grid line for col group gap
                if (s.yTextAxis.showGrid) {
                    ctx.strokeStyle = s.gridColor;
                    ctx.lineWidth = s.gridStrokeWidth;
                    ctx.beginPath();
                    ctx.moveTo(chartAreaX, tickCY);
                    ctx.lineTo(chartAreaRight, tickCY);
                    ctx.stroke();
                }
            }
            colBarCurrentY += s.yTextAxis.colGroupGap + s.gridStrokeWidth;
        }
    });
    return {
        colGroups: colGroups,
        xMax,
        xMin,
        dataLabelDimensions,
    };
}
