import { addAxesXScaleYScale } from "./_axes/add_axes_xscale_yscale.ts";
import { addPointWithDataLabel } from "./_helpers/add_point_with_data_label.ts";
import { Coordinates, createArray, } from "./deps.ts";
export function renderChartMainContentScatter(ctx, data, rpd, s, paletteColors, palettePointStyles) {
    const { xMax, yMax, xMin, yMin, chartArea, dataLabelDimensions, xAxisTickValues, } = addAxesXScaleYScale(ctx, data, rpd, s);
    data.series.forEach((ser, i_ser) => {
        ser.values.forEach((val, i_val) => {
            const seriesPointColor = paletteColors.paletteType === "by-row"
                ? paletteColors.colors[i_ser]
                : paletteColors.paletteType === "by-col"
                    ? paletteColors.colors[i_val]
                    : paletteColors.paletteType === "func"
                        ? paletteColors.func(i_ser, i_val, -1, -1)
                        : paletteColors.color;
            const seriesPointStyle = palettePointStyles.paletteType === "by-row"
                ? palettePointStyles.pointStyles[i_ser]
                : palettePointStyles.paletteType === "by-col"
                    ? palettePointStyles.pointStyles[i_val]
                    : palettePointStyles.pointStyle;
            const valX = chartArea.x() +
                ((val.x.pe - xMin) / (xMax - xMin)) * chartArea.w() -
                s.gridStrokeWidth / 2;
            const valY = chartArea.y() +
                (1 - (val.y.pe - yMin) / (yMax - yMin)) * chartArea.h() +
                s.gridStrokeWidth / 2;
            const dataLabelDims = dataLabelDimensions[i_ser][i_val];
            const positionOrOffset = dataLabelDims
                ? data.dataLabelPositionMap?.[dataLabelDims.lines[0].text]
                : undefined;
            const offsettedCoords = new Coordinates({
                x: valX,
                y: valY,
            }).getOffsetted(positionOrOffset, s.alreadyScaledValue);
            addPointWithDataLabel(ctx, {
                pointStyle: seriesPointStyle,
                x: valX,
                y: valY,
                color: seriesPointColor,
                dataLabel: s.withDataLabels && dataLabelDims
                    ? {
                        m: dataLabelDims,
                        position: positionOrOffset?.position ??
                            s.dataLabelPositionTwoWayScale,
                        offsetX: offsettedCoords.x() - valX,
                        offsetY: offsettedCoords.y() - valY,
                    }
                    : undefined,
            }, s);
        });
    });
    if (data.lineFunction) {
        const lastVal = xAxisTickValues.at(-1);
        const increment = lastVal / 100;
        const xVals = [0, ...createArray(100, (i) => (i + 1) * increment)];
        ctx.strokeStyle = "rgb(239,68,68)";
        ctx.lineWidth = s.axisStrokeWidth;
        ctx.beginPath();
        xVals.forEach((x, i) => {
            const y = data.lineFunction(x);
            const valX = chartArea.x() + (x / xMax) * chartArea.w() - s.gridStrokeWidth / 2;
            const valY = chartArea.y() + (1 - y / yMax) * chartArea.h() + s.gridStrokeWidth / 2;
            if (i === 0) {
                ctx.moveTo(valX, valY);
            }
            else {
                ctx.lineTo(valX, valY);
            }
        });
        ctx.stroke();
    }
}