import { addAxesXScaleYText } from "./_axes/add_axes_xscale_ytext.ts";
import { addAxesXTextYScale } from "./_axes/add_axes_xtext_yscale.ts";
import { addErrorBars } from "./_helpers/add_error_bars.ts";
import { addPointWithDataLabel, } from "./_helpers/add_point_with_data_label.ts";
import { createArray, getAdjustedColor, } from "./deps.ts";
export function renderChartMainContentPoint(ctx, data, rpd, s, paletteColors, palettePointStyles) {
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
        const { colGroups, xMax, xMin, dataLabelDimensions } = addAxesXScaleYText(ctx, data, rpd, s, "point", "center");
        const prevPoints = createArray(data.rowHeaders.length, { x: -1, y: -1 });
        const deferredPointsToAdd = [];
        const deferredArrowsToAdd = [];
        colGroups.forEach((colGroup, i_colGroup) => {
            colGroup.cols.forEach((cgc, i_colInColGroup) => {
                const arrow = [];
                // ctx.fillStyle = "orange";
                // ctx.fillRect(cgc.coords.x, cgc.coords.y, cgc.coords.w, cgc.coords.h);
                const i_col = cgc.colIndexInAoA;
                const sortedRowValuesWithIndex = data.aoa
                    .map((row, i_row) => {
                    return { peBounds: row[i_col], index: i_row };
                })
                    .toSorted((a, b) => a.peBounds.pe - b.peBounds.pe);
                data.rowHeaders.forEach((_, i_row) => {
                    const ordinalPositionWithinColumn = sortedRowValuesWithIndex.findIndex((a) => a.index === i_row);
                    const dataLabelPosition = s.dataLabelPositionHorizontalScale !== "alternating"
                        ? s.dataLabelPositionHorizontalScale
                        : ordinalPositionWithinColumn % 2 == 0
                            ? "top"
                            : "bottom";
                    const seriesPointColor = paletteColors.paletteType === "by-row"
                        ? paletteColors.colors[i_row]
                        : paletteColors.paletteType === "by-col"
                            ? paletteColors.colors[i_col]
                            : paletteColors.paletteType === "func"
                                ? paletteColors.func(i_row, i_col, i_colGroup, i_colInColGroup)
                                : paletteColors.color;
                    const seriesPointStyle = palettePointStyles.paletteType === "by-row"
                        ? palettePointStyles.pointStyles[i_row]
                        : palettePointStyles.paletteType === "by-col"
                            ? palettePointStyles.pointStyles[i_col]
                            : palettePointStyles.pointStyle;
                    const cellPbe = data.aoa[i_row][i_col];
                    const pointWidth = cgc.coords.w * ((cellPbe.pe - xMin) / (xMax - xMin));
                    const pointX = Math.max(cgc.coords.x + pointWidth - s.gridStrokeWidth / 2, cgc.coords.x - s.gridStrokeWidth / 2);
                    if (s.withArrows) {
                        arrow.push([pointX, cgc.coords.cy]);
                    }
                    if (s.withOutline) {
                        const prevPoint = prevPoints[i_row];
                        if (prevPoint.x >= 0 && prevPoint.y >= 0) {
                            ctx.strokeStyle = seriesPointColor;
                            ctx.lineWidth = s.axisStrokeWidth;
                            ctx.beginPath();
                            ctx.moveTo(prevPoint.x, prevPoint.y);
                            ctx.lineTo(pointX, cgc.coords.cy);
                            ctx.stroke();
                        }
                        prevPoints[i_row].x = pointX;
                        prevPoints[i_row].y = cgc.coords.cy;
                    }
                    deferredPointsToAdd.push({
                        x: pointX,
                        y: cgc.coords.cy,
                        color: seriesPointColor,
                        pointStyle: seriesPointStyle,
                        dataLabel: s.withDataLabels
                            ? {
                                m: dataLabelDimensions[i_row][i_col],
                                position: dataLabelPosition,
                            }
                            : undefined,
                    });
                    if (cellPbe.lb !== undefined && cellPbe.ub !== undefined) {
                        addErrorBars(ctx, {
                            x: cgc.coords.cy,
                            b: cgc.coords.x + cgc.coords.w * (cellPbe.lb / xMax),
                            t: cgc.coords.x + cgc.coords.w * (cellPbe.ub / xMax),
                            w: (s.pointRadius * 2 + s.pointStrokeWidth) *
                                s.errorBarWidthProportionOfPoint,
                            color: getAdjustedColor(seriesPointColor, s.errorBarColorStrategy),
                            horizontal: true,
                        }, s);
                    }
                });
                deferredArrowsToAdd.push(arrow);
            });
        });
        deferredPointsToAdd.forEach((p) => {
            addPointWithDataLabel(ctx, p, s);
        });
        if (s.withArrows) {
            deferredArrowsToAdd.forEach((arrow) => {
                ctx.strokeStyle = "#009bb5";
                ctx.lineWidth = 10;
                const ww = 80;
                const aa = 30;
                const x1 = arrow[0][0];
                const x2 = arrow[1][0];
                ctx.beginPath();
                if (Math.abs(x1 - x2) > 200) {
                    if (x1 < x2) {
                        ctx.moveTo(x1 + ww, arrow[0][1]);
                        ctx.lineTo(x2 - ww, arrow[1][1]);
                        ctx.moveTo(x2 - (ww + aa), arrow[1][1] + aa);
                        ctx.lineTo(x2 - ww, arrow[1][1]);
                        ctx.lineTo(x2 - (ww + aa), arrow[1][1] - aa);
                    }
                    else {
                        ctx.moveTo(x1 - ww, arrow[0][1]);
                        ctx.lineTo(x2 + ww, arrow[1][1]);
                        ctx.moveTo(x2 + (ww + aa), arrow[1][1] + aa);
                        ctx.lineTo(x2 + ww, arrow[1][1]);
                        ctx.lineTo(x2 + (ww + aa), arrow[1][1] - aa);
                    }
                }
                else if (Math.abs(x1 - x2) > 80) {
                    // if (x1 < x2) {
                    //   const xC = x1 + (x2 - x1) / 2;
                    //   ctx.moveTo(xC - 10, arrow[1][1] + 20);
                    //   ctx.lineTo(xC + 10, arrow[1][1]);
                    //   ctx.lineTo(xC - 10, arrow[1][1] - 20);
                    // } else {
                    //   const xC = x2 + (x1 - x2) / 2;
                    //   ctx.moveTo(xC + 10, arrow[1][1] + 20);
                    //   ctx.lineTo(xC - 10, arrow[1][1]);
                    //   ctx.lineTo(xC + 10, arrow[1][1] - 20);
                    // }
                }
                ctx.stroke();
            });
        }
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
        const { colGroups, yMax, yMin, dataLabelDimensions } = addAxesXTextYScale(ctx, data, rpd, s, "point", "center");
        const prevPoints = createArray(data.rowHeaders.length, { x: -1, y: -1 });
        const deferredPointsToAdd = [];
        colGroups.forEach((colGroup, i_colGroup) => {
            colGroup.cols.forEach((cgc, i_colInColGroup) => {
                // ctx.fillStyle = "orange";
                // ctx.fillRect(cgc.coords.x, cgc.coords.y, cgc.coords.w, cgc.coords.h);
                const i_col = cgc.colIndexInAoA;
                const sortedRowValuesWithIndex = data.aoa
                    .map((row, i_row) => {
                    return { peBounds: row[i_col], index: i_row };
                })
                    .toSorted((a, b) => a.peBounds.pe - b.peBounds.pe);
                data.rowHeaders.forEach((_, i_row) => {
                    const ordinalPositionWithinColumn = sortedRowValuesWithIndex.findIndex((a) => a.index === i_row);
                    const dataLabelPosition = s.dataLabelPositionVerticalScale !== "alternating"
                        ? s.dataLabelPositionVerticalScale
                        : ordinalPositionWithinColumn % 2 == 0
                            ? "left"
                            : "right";
                    const seriesPointColor = paletteColors.paletteType === "by-row"
                        ? paletteColors.colors[i_row]
                        : paletteColors.paletteType === "by-col"
                            ? paletteColors.colors[i_col]
                            : paletteColors.paletteType === "func"
                                ? paletteColors.func(i_row, i_col, i_colGroup, i_colInColGroup)
                                : paletteColors.color;
                    const seriesPointStyle = palettePointStyles.paletteType === "by-row"
                        ? palettePointStyles.pointStyles[i_row]
                        : palettePointStyles.paletteType === "by-col"
                            ? palettePointStyles.pointStyles[i_col]
                            : palettePointStyles.pointStyle;
                    const cellPbe = data.aoa[i_row][i_col];
                    const pointHeight = cgc.coords.h * ((cellPbe.pe - yMin) / (yMax - yMin));
                    const pointTopOffset = cgc.coords.h - pointHeight;
                    const pointY = Math.min(cgc.coords.y + pointTopOffset + s.gridStrokeWidth / 2, cgc.coords.y + cgc.coords.h + s.gridStrokeWidth / 2);
                    if (s.withOutline) {
                        const prevPoint = prevPoints[i_row];
                        if (prevPoint.x >= 0 && prevPoint.y >= 0) {
                            ctx.strokeStyle = seriesPointColor;
                            ctx.lineWidth = s.axisStrokeWidth;
                            ctx.beginPath();
                            ctx.moveTo(prevPoint.x, prevPoint.y);
                            ctx.lineTo(cgc.coords.cx, pointY);
                            ctx.stroke();
                        }
                        prevPoints[i_row].x = cgc.coords.cx;
                        prevPoints[i_row].y = pointY;
                    }
                    deferredPointsToAdd.push({
                        x: cgc.coords.cx,
                        y: pointY,
                        color: seriesPointColor,
                        pointStyle: seriesPointStyle,
                        dataLabel: s.withDataLabels
                            ? {
                                m: dataLabelDimensions[i_row][i_col],
                                position: dataLabelPosition,
                            }
                            : undefined,
                    });
                    if (cellPbe.lb !== undefined && cellPbe.ub !== undefined) {
                        addErrorBars(ctx, {
                            x: cgc.coords.cx,
                            b: cgc.coords.y + cgc.coords.h * (1 - cellPbe.lb / yMax),
                            t: cgc.coords.y + cgc.coords.h * (1 - cellPbe.ub / yMax),
                            w: (s.pointRadius * 2 + s.pointStrokeWidth) *
                                s.errorBarWidthProportionOfPoint,
                            color: getAdjustedColor(seriesPointColor, s.errorBarColorStrategy),
                            horizontal: false,
                        }, s);
                    }
                });
            });
        });
        deferredPointsToAdd.forEach((p) => {
            addPointWithDataLabel(ctx, p, s);
        });
    }
}
