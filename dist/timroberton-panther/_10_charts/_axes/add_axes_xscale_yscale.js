import { RectCoordsDims, avg, measureText, measureVerticalText, writeText, writeVerticalText, } from "../deps.ts";
import { getGoodAxisTickValuesFromMaxValue } from "./get_good_axis_tick_values.ts";
import { getDataLabelDimensionsSeries, getMaxValuesFromSeries, getXScaleAxisTickLabelDimensions, getYScaleAxisTickLabelDimensions, } from "./utils.ts";
export function addAxesXScaleYScale(ctx, data, rpd, s) {
    const { x, y, w, h } = rpd.asObject();
    const bottomY = y + h;
    const rightX = x + w;
    const dataLabelDimensions = getDataLabelDimensionsSeries(ctx, s, data.series);
    // Get initial widths
    const startingNTicks = 6;
    const fromSeries = getMaxValuesFromSeries(data.series);
    const maxXValue = s.xScaleAxis.max === "auto" ? fromSeries.xMaxValue : s.xScaleAxis.max;
    const maxYValue = s.yScaleAxis.max === "auto" ? fromSeries.yMaxValue : s.yScaleAxis.max;
    const minXValue = s.xScaleAxis.min === "auto"
        ? (() => {
            throw new Error("Not yet implemented");
        })()
        : s.xScaleAxis.min;
    const minYValue = s.yScaleAxis.min === "auto"
        ? (() => {
            throw new Error("Not yet implemented");
        })()
        : s.yScaleAxis.min;
    let xAxisTickValues = getGoodAxisTickValuesFromMaxValue(maxXValue, minXValue, startingNTicks, s.xScaleAxis.tickLabelFormatter);
    let yAxisTickValues = getGoodAxisTickValuesFromMaxValue(maxYValue, minYValue, startingNTicks, s.yScaleAxis.tickLabelFormatter);
    let xMax = xAxisTickValues.at(-1);
    let yMax = yAxisTickValues.at(-1);
    const xMin = xAxisTickValues.at(0);
    const yMin = yAxisTickValues.at(0);
    let xAxisTickLabelDimensions = getXScaleAxisTickLabelDimensions(ctx, s, xAxisTickValues, Number.POSITIVE_INFINITY);
    let yAxisTickLabelDimensions = getYScaleAxisTickLabelDimensions(ctx, s, xAxisTickValues, Number.POSITIVE_INFINITY);
    const { w: xAxisTickLabelMaxValueWidth, h: xAxisTickLabelMaxValueHeight } = xAxisTickLabelDimensions.at(-1).dims.asObject();
    const { w: yAxisTickLabelMaxValueWidth, h: yAxisTickLabelMaxValueHeight } = yAxisTickLabelDimensions.at(-1).dims.asObject();
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  __      __                                                                        __                      //
    // /  \    /  |                                                                      /  |                     //
    // $$  \  /$$/        _____  ____    ______    ______    _______  __    __   ______  $$/  _______    ______   //
    //  $$  \/$$/        /     \/    \  /      \  /      \  /       |/  |  /  | /      \ /  |/       \  /      \  //
    //   $$  $$/         $$$$$$ $$$$  |/$$$$$$  | $$$$$$  |/$$$$$$$/ $$ |  $$ |/$$$$$$  |$$ |$$$$$$$  |/$$$$$$  | //
    //    $$$$/          $$ | $$ | $$ |$$    $$ | /    $$ |$$      \ $$ |  $$ |$$ |  $$/ $$ |$$ |  $$ |$$ |  $$ | //
    //     $$ |          $$ | $$ | $$ |$$$$$$$$/ /$$$$$$$ | $$$$$$  |$$ \__$$ |$$ |      $$ |$$ |  $$ |$$ \__$$ | //
    //     $$ |          $$ | $$ | $$ |$$       |$$    $$ |/     $$/ $$    $$/ $$ |      $$ |$$ |  $$ |$$    $$ | //
    //     $$/           $$/  $$/  $$/  $$$$$$$/  $$$$$$$/ $$$$$$$/   $$$$$$/  $$/       $$/ $$/   $$/  $$$$$$$ | //
    //                                                                                                 /  \__$$ | //
    //                                                                                                 $$    $$/  //
    //                                                                                                  $$$$$$/   //
    //                                                                                                            //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const yAxisLabelX = x;
    let mYAxisLabel = undefined;
    let yAxisLabelAndGapWidth = 0;
    if (data.yAxisLabel?.trim()) {
        mYAxisLabel = measureVerticalText(ctx, data.yAxisLabel.trim(), s.text.yScaleAxisLabel, Number.POSITIVE_INFINITY);
        yAxisLabelAndGapWidth = mYAxisLabel.dims.w() + s.yScaleAxis.labelGap;
    }
    const yAxisTickLabelX = yAxisLabelX + yAxisLabelAndGapWidth;
    const yAxisTickLabelRight = yAxisTickLabelX + yAxisTickLabelMaxValueWidth;
    const yAxisTickX = yAxisTickLabelRight + s.yScaleAxis.tickLabelGap;
    const yAxisVerticalLineX = yAxisTickX + s.yScaleAxis.tickWidth;
    const chartAreaX = yAxisVerticalLineX + s.axisStrokeWidth;
    // This needs to be redone
    const topOverhang = (yAxisTickLabelMaxValueHeight - s.gridStrokeWidth) / 2;
    const chartAreaY = y + topOverhang;
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  __    __                                                                        __                      //
    // /  |  /  |                                                                      /  |                     //
    // $$ |  $$ |       _____  ____    ______    ______    _______  __    __   ______  $$/  _______    ______   //
    // $$  \/$$/       /     \/    \  /      \  /      \  /       |/  |  /  | /      \ /  |/       \  /      \  //
    //  $$  $$<        $$$$$$ $$$$  |/$$$$$$  | $$$$$$  |/$$$$$$$/ $$ |  $$ |/$$$$$$  |$$ |$$$$$$$  |/$$$$$$  | //
    //   $$$$  \       $$ | $$ | $$ |$$    $$ | /    $$ |$$      \ $$ |  $$ |$$ |  $$/ $$ |$$ |  $$ |$$ |  $$ | //
    //  $$ /$$  |      $$ | $$ | $$ |$$$$$$$$/ /$$$$$$$ | $$$$$$  |$$ \__$$ |$$ |      $$ |$$ |  $$ |$$ \__$$ | //
    // $$ |  $$ |      $$ | $$ | $$ |$$       |$$    $$ |/     $$/ $$    $$/ $$ |      $$ |$$ |  $$ |$$    $$ | //
    // $$/   $$/       $$/  $$/  $$/  $$$$$$$/  $$$$$$$/ $$$$$$$/   $$$$$$/  $$/       $$/ $$/   $$/  $$$$$$$ | //
    //                                                                                               /  \__$$ | //
    //                                                                                               $$    $$/  //
    //                                                                                                $$$$$$/   //
    //                                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let mXAxisLabel = undefined;
    let xAxisLabelAndGapHeight = 0;
    if (data.xAxisLabel?.trim()) {
        mXAxisLabel = measureText(ctx, data.xAxisLabel.trim(), s.text.xScaleAxisLabel, Number.POSITIVE_INFINITY);
        xAxisLabelAndGapHeight = mXAxisLabel.dims.h() + s.xScaleAxis.labelGap;
    }
    const xAxisTickLabelY = bottomY - (xAxisLabelAndGapHeight + xAxisTickLabelMaxValueHeight);
    const xAxisTickY = xAxisTickLabelY - (s.xScaleAxis.tickLabelGap + s.xScaleAxis.tickHeight);
    const xAxisHorizontalLineY = xAxisTickY - s.axisStrokeWidth;
    const chartAreaBottom = xAxisHorizontalLineY;
    // This needs to be redone
    const rightOverhang = (xAxisTickLabelMaxValueWidth - s.gridStrokeWidth) / 2;
    const chartAreaRight = rightX - rightOverhang;
    const chartAreaHeight = chartAreaBottom - chartAreaY;
    const chartAreaWidth = chartAreaRight - chartAreaX;
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //  _______                                                                                       //
    // /       \                                                                                      //
    // $$$$$$$  |  ______   _____  ____    ______    ______    _______  __    __   ______    ______   //
    // $$ |__$$ | /      \ /     \/    \  /      \  /      \  /       |/  |  /  | /      \  /      \  //
    // $$    $$< /$$$$$$  |$$$$$$ $$$$  |/$$$$$$  | $$$$$$  |/$$$$$$$/ $$ |  $$ |/$$$$$$  |/$$$$$$  | //
    // $$$$$$$  |$$    $$ |$$ | $$ | $$ |$$    $$ | /    $$ |$$      \ $$ |  $$ |$$ |  $$/ $$    $$ | //
    // $$ |  $$ |$$$$$$$$/ $$ | $$ | $$ |$$$$$$$$/ /$$$$$$$ | $$$$$$  |$$ \__$$ |$$ |      $$$$$$$$/  //
    // $$ |  $$ |$$       |$$ | $$ | $$ |$$       |$$    $$ |/     $$/ $$    $$/ $$ |      $$       | //
    // $$/   $$/  $$$$$$$/ $$/  $$/  $$/  $$$$$$$/  $$$$$$$/ $$$$$$$/   $$$$$$/  $$/        $$$$$$$/  //
    //                                                                                                //
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // If needed, add more y Axis ticks, but keep same max value
    const maxNumberYTicks = Math.ceil((0.5 * chartAreaHeight) / yAxisTickLabelMaxValueHeight);
    if (maxNumberYTicks > startingNTicks + 1) {
        const newYAxisTickValues = getGoodAxisTickValuesFromMaxValue(yAxisTickValues.at(-1) * 0.999, minYValue, maxNumberYTicks, s.yScaleAxis.tickLabelFormatter);
        yAxisTickValues = newYAxisTickValues;
        yMax = newYAxisTickValues.at(-1);
        yAxisTickLabelDimensions = getYScaleAxisTickLabelDimensions(ctx, s, newYAxisTickValues, Number.POSITIVE_INFINITY);
    }
    // If needed, add more x Axis ticks, but keep same max value
    const avgTickLabelWidth = avg(yAxisTickLabelDimensions.map((tl) => tl.dims.w()));
    const maxNumberXTicks = Math.ceil((0.5 * chartAreaWidth) / avgTickLabelWidth);
    if (maxNumberXTicks > startingNTicks + 1) {
        const newXAxisTickValues = getGoodAxisTickValuesFromMaxValue(xAxisTickValues.at(-1) * 0.999, minXValue, maxNumberXTicks, s.xScaleAxis.tickLabelFormatter);
        xAxisTickValues = newXAxisTickValues;
        xMax = newXAxisTickValues.at(-1);
        xAxisTickLabelDimensions = getXScaleAxisTickLabelDimensions(ctx, s, newXAxisTickValues, Number.POSITIVE_INFINITY);
    }
    // TO DO... could recalculate chart width (only) based on new max X and Y tick label widths
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
    ctx.lineTo(yAxisVerticalLineX + s.axisStrokeWidth / 2, xAxisHorizontalLineY + s.axisStrokeWidth);
    ctx.stroke();
    if (data.yAxisLabel?.trim() && mYAxisLabel) {
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
    ctx.strokeStyle = s.axisColor;
    ctx.lineWidth = s.axisStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(chartAreaX, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.lineTo(chartAreaRight, xAxisHorizontalLineY + s.axisStrokeWidth / 2);
    ctx.stroke();
    if (data.xAxisLabel?.trim() && mXAxisLabel) {
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
    return {
        chartArea: new RectCoordsDims({
            x: chartAreaX,
            y: chartAreaY,
            w: chartAreaWidth,
            h: chartAreaHeight,
        }),
        xMax,
        yMax,
        xMin,
        yMin,
        dataLabelDimensions,
        xAxisTickValues,
    };
}
