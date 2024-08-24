import { addAxesXScaleYText } from "./_axes/add_axes_xscale_ytext.ts";
import { addAxesXTextYScale } from "./_axes/add_axes_xtext_yscale.ts";
import { addBarOutline } from "./_helpers/add_bar_outline.ts";
import { addCascadeArrow } from "./_helpers/add_cascade_arrows.ts";
import { addErrorBars } from "./_helpers/add_error_bars.ts";
import { divideOrZero, getAdjustedColor, writeText, } from "./deps.ts";
export function renderChartMainContentBar(ctx, data, rpd, s, paletteColors) {
    //////////////////////////////////////////////////////////////////////////////////////////////
    //  __    __                      __                                  __                __  //
    // /  |  /  |                    /  |                                /  |              /  | //
    // $$ |  $$ |  ______    ______  $$/  ________   ______   _______   _$$ |_     ______  $$ | //
    // $$ |__$$ | /      \  /      \ /  |/        | /      \ /       \ / $$   |   /      \ $$ | //
    // $$    $$ |/$$$$$$  |/$$$$$$  |$$ |$$$$$$$$/ /$$$$$$  |$$$$$$$  |$$$$$$/    $$$$$$  |$$ | //
    // $$$$$$$$ |$$ |  $$ |$$ |  $$/ $$ |  /  $$/  $$ |  $$ |$$ |  $$ |  $$ | __  /    $$ |$$ | //
    // $$ |  $$ |$$ \__$$ |$$ |      $$ | /$$$$/__ $$ \__$$ |$$ |  $$ |  $$ |/  |/$$$$$$$ |$$ | //
    // $$ |  $$ |$$    $$/ $$ |      $$ |/$$      |$$    $$/ $$ |  $$ |  $$  $$/ $$    $$ |$$ | //
    // $$/   $$/  $$$$$$/  $$/       $$/ $$$$$$$$/  $$$$$$/  $$/   $$/    $$$$/   $$$$$$$/ $$/  //
    //                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////
    if (s.horizontal === true) {
        const { colGroups, xMax, xMin, dataLabelDimensions } = addAxesXScaleYText(ctx, data, rpd, s, "bar", "ends");
        colGroups.forEach((colGroup, i_colGroup) => {
            colGroup.cols.forEach((cgc, i_colInColGroup) => {
                // ctx.fillStyle = "orange";
                // ctx.fillRect(cgc.coords.x, cgc.coords.y, cgc.coords.w, cgc.coords.h);
                const colBarHeight = cgc.coords.h * s.pctOfCol;
                const colBarYOffset = (cgc.coords.h - colBarHeight) / 2;
                const nSeries = data.rowHeaders.length;
                const seriesAreaHeight = s.stacked !== "not-stacked" ? colBarHeight : colBarHeight / nSeries;
                const seriesBarHeight = seriesAreaHeight * s.pctOfSeries;
                const seriesBarYOffset = (seriesAreaHeight - seriesBarHeight) / 2;
                const i_col = cgc.colIndexInAoA;
                let seriesBarCurrentY = cgc.coords.y + colBarYOffset;
                let prevSeriesWidth = 0;
                data.rowHeaders.forEach((_, i_row) => {
                    const seriesBarColor = paletteColors.paletteType === "by-row"
                        ? paletteColors.colors[i_row]
                        : paletteColors.paletteType === "by-col"
                            ? paletteColors.colors[i_col]
                            : paletteColors.paletteType === "func"
                                ? paletteColors.func(i_row, i_col, i_colGroup, i_colInColGroup)
                                : paletteColors.color;
                    const cellPbe = data.aoa[i_row][i_col];
                    const barWidth = cgc.coords.w * ((cellPbe.pe - xMin) / (xMax - xMin));
                    if (s.withBars) {
                        ctx.fillStyle = getAdjustedColor(seriesBarColor, {
                            opacity: s.barOpacity,
                        });
                        ctx.fillRect(cgc.coords.x + prevSeriesWidth, seriesBarCurrentY + seriesBarYOffset, barWidth, seriesBarHeight);
                        if (cellPbe.lb !== undefined && cellPbe.ub !== undefined) {
                            addErrorBars(ctx, {
                                x: seriesBarCurrentY + seriesBarYOffset + seriesBarHeight / 2,
                                b: cgc.coords.x + cgc.coords.w * (cellPbe.lb / xMax),
                                t: cgc.coords.x + cgc.coords.w * (cellPbe.ub / xMax),
                                w: seriesBarHeight * s.errorBarWidthProportionOfBar,
                                color: getAdjustedColor(seriesBarColor, s.errorBarColorStrategy),
                                horizontal: true,
                            }, s);
                        }
                    }
                    if (s.withDataLabels) {
                        const m = dataLabelDimensions[i_row][i_col];
                        writeText(ctx, m, cgc.coords.x + prevSeriesWidth + barWidth + s.dataLabelGapXBars, seriesBarCurrentY +
                            seriesBarYOffset +
                            (seriesBarHeight - m.dims.h()) / 2, "left");
                    }
                    if (s.stacked === "not-stacked") {
                        seriesBarCurrentY += seriesAreaHeight;
                    }
                    if (s.stacked === "stacked") {
                        prevSeriesWidth += barWidth;
                    }
                });
            });
        });
    }
    //////////////////////////////////////////////////////////////////////////
    //  __     __                       __      __                      __  //
    // /  |   /  |                     /  |    /  |                    /  | //
    // $$ |   $$ | ______    ______   _$$ |_   $$/   _______   ______  $$ | //
    // $$ |   $$ |/      \  /      \ / $$   |  /  | /       | /      \ $$ | //
    // $$  \ /$$//$$$$$$  |/$$$$$$  |$$$$$$/   $$ |/$$$$$$$/  $$$$$$  |$$ | //
    //  $$  /$$/ $$    $$ |$$ |  $$/   $$ | __ $$ |$$ |       /    $$ |$$ | //
    //   $$ $$/  $$$$$$$$/ $$ |        $$ |/  |$$ |$$ \_____ /$$$$$$$ |$$ | //
    //    $$$/   $$       |$$ |        $$  $$/ $$ |$$       |$$    $$ |$$ | //
    //     $/     $$$$$$$/ $$/          $$$$/  $$/  $$$$$$$/  $$$$$$$/ $$/  //
    //                                                                      //
    //////////////////////////////////////////////////////////////////////////
    if (s.horizontal === false) {
        const { colGroups, yMax, yMin, dataLabelDimensions } = addAxesXTextYScale(ctx, data, rpd, s, "bar", "ends");
        const prevArrowCoords = data.rowHeaders.map(() => undefined);
        const outlineCols = data.rowHeaders.map((_, i_row) => {
            return {
                color: paletteColors.paletteType === "by-row"
                    ? paletteColors.colors[i_row]
                    : paletteColors.paletteType === "by-col"
                        ? paletteColors.colors[0]
                        : paletteColors.paletteType === "func"
                            ? paletteColors.func(0, 0, 0, 0)
                            : paletteColors.color,
                coords: [],
            };
        });
        colGroups.forEach((colGroup, i_colGroup) => {
            colGroup.cols.forEach((cgc, i_colInColGroup) => {
                const colBarWidth = cgc.coords.w * s.pctOfCol;
                const colBarXOffset = (cgc.coords.w - colBarWidth) / 2;
                const nSeries = data.rowHeaders.length;
                const seriesAreaWidth = s.stacked !== "not-stacked" ? colBarWidth : colBarWidth / nSeries;
                const seriesBarWidth = seriesAreaWidth * s.pctOfSeries;
                const seriesBarXOffset = (seriesAreaWidth - seriesBarWidth) / 2;
                const i_col = cgc.colIndexInAoA;
                let seriesBarCurrentX = cgc.coords.x + colBarXOffset;
                let prevSeriesHeight = 0;
                data.rowHeaders.forEach((_, i_row) => {
                    const seriesBarColor = paletteColors.paletteType === "by-row"
                        ? paletteColors.colors[i_row]
                        : paletteColors.paletteType === "by-col"
                            ? paletteColors.colors[i_col]
                            : paletteColors.paletteType === "func"
                                ? paletteColors.func(i_row, i_col, i_colGroup, i_colInColGroup)
                                : paletteColors.color;
                    const cellPbe = data.aoa[i_row][i_col];
                    const barHeight = cgc.coords.h * ((cellPbe.pe - yMin) / (yMax - yMin));
                    const barTopOffset = cgc.coords.h - barHeight;
                    if (s.withBars) {
                        ctx.fillStyle = getAdjustedColor(seriesBarColor, {
                            opacity: s.barOpacity,
                        });
                        const extraToHideGaps = Math.min(1, prevSeriesHeight);
                        ctx.fillRect(seriesBarCurrentX + seriesBarXOffset, cgc.coords.y + barTopOffset - prevSeriesHeight, seriesBarWidth, barHeight + extraToHideGaps);
                        if (cellPbe.lb !== undefined && cellPbe.ub !== undefined) {
                            addErrorBars(ctx, {
                                x: seriesBarCurrentX + seriesBarXOffset + seriesBarWidth / 2,
                                b: cgc.coords.y + cgc.coords.h * (1 - cellPbe.lb / yMax),
                                t: cgc.coords.y + cgc.coords.h * (1 - cellPbe.ub / yMax),
                                w: seriesBarWidth * s.errorBarWidthProportionOfBar,
                                color: getAdjustedColor(seriesBarColor, s.errorBarColorStrategy),
                                horizontal: false,
                            }, s);
                        }
                    }
                    outlineCols[i_row].coords.push({
                        xLeft: seriesBarCurrentX + seriesBarXOffset,
                        xRight: seriesBarCurrentX + seriesBarXOffset + seriesBarWidth,
                        y: cgc.coords.y +
                            barTopOffset +
                            s.axisStrokeWidth / 2 -
                            prevSeriesHeight,
                    });
                    const newArrowCoords = {
                        x: seriesBarCurrentX + seriesBarXOffset,
                        y: cgc.coords.y + barTopOffset - prevSeriesHeight,
                    };
                    if (prevArrowCoords[i_row] !== undefined) {
                        if (s.withArrows &&
                            (s.withArrows === true ||
                                s.withArrows(i_row, i_col, i_colGroup, i_colInColGroup))) {
                            const diffY = newArrowCoords.y - prevArrowCoords[i_row].arrowStart.y;
                            const prevBarH = barHeight + diffY;
                            if (prevBarH > 0) {
                                const pctReduction = divideOrZero(barHeight, prevBarH);
                                const arrowColor = s.cascadeArrows.arrowColor(i_row, i_col, i_colGroup, i_colInColGroup);
                                const upperLabel = s.cascadeArrows.upperLabels === "none"
                                    ? undefined
                                    : s.cascadeArrows.upperLabels(i_row, i_col, i_colGroup, i_colInColGroup);
                                addCascadeArrow(ctx, prevArrowCoords[i_row].arrowStart, newArrowCoords, pctReduction, prevArrowCoords[i_row].prevBarCenterX, cgc.coords.cx, arrowColor, upperLabel, cgc.coords.y, s);
                            }
                        }
                    }
                    prevArrowCoords[i_row] = {
                        arrowStart: {
                            x: newArrowCoords.x + seriesBarWidth,
                            y: newArrowCoords.y,
                        },
                        prevBarCenterX: cgc.coords.cx,
                    };
                    if (s.withDataLabels &&
                        (s.stacked === "not-stacked" || i_row === 0)) {
                        const m = dataLabelDimensions[i_row][i_col];
                        writeText(ctx, m, seriesBarCurrentX +
                            seriesBarXOffset +
                            seriesBarWidth / 2 +
                            s.dataLabelOffsetXBars, cgc.coords.y +
                            barTopOffset -
                            (s.dataLabelGapYBars + m.dims.h() + prevSeriesHeight), "center");
                    }
                    if (s.stacked === "not-stacked") {
                        seriesBarCurrentX += seriesAreaWidth;
                    }
                    if (s.stacked === "stacked") {
                        prevSeriesHeight += barHeight;
                    }
                });
            });
            if (s.withOutline) {
                addBarOutline(ctx, outlineCols, s);
            }
        });
        return;
    }
}
