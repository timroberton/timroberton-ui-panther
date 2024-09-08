import { addAxesXScaleYScale } from "./_axes/add_axes_xscale_yscale";
import { addPointWithDataLabel } from "./_helpers/add_point_with_data_label";
import { Coordinates, createArray, getColor, } from "./deps";
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
    if (data.lines) {
        data.lines.forEach((line) => {
            const nIncrements = line.nIncrements ?? 100;
            const firstVal = xAxisTickValues.at(0);
            const lastVal = xAxisTickValues.at(-1);
            const increment = (lastVal - firstVal) / nIncrements;
            const xVals = createArray(nIncrements + 1, (i) => firstVal + i * increment);
            ctx.strokeStyle = line.color ? getColor(line.color) : s.axisColor;
            ctx.lineWidth = line.strokeWidth
                ? line.strokeWidth * s.alreadyScaledValue
                : s.axisStrokeWidth;
            ctx.beginPath();
            let isFirstPoint = true;
            xVals.forEach((x, i) => {
                const y = line.lineFunction(x);
                if (y === undefined) {
                    return;
                }
                const valX = chartArea.x() +
                    ((x - xMin) / (xMax - xMin)) * chartArea.w() -
                    s.gridStrokeWidth / 2;
                const valY = chartArea.y() +
                    (1 - (y - yMin) / (yMax - yMin)) * chartArea.h() +
                    s.gridStrokeWidth / 2;
                if (isFirstPoint) {
                    ctx.moveTo(valX, valY);
                    isFirstPoint = false;
                }
                else {
                    ctx.lineTo(valX, valY);
                }
            });
            ctx.stroke();
        });
    }
}
