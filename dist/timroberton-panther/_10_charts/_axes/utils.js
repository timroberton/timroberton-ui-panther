import { measureText, measureVerticalText, } from "../deps";
export function getMaxValueFromAoA(aoa, stacked) {
    if (stacked) {
        if (aoa.length === 0) {
            throw new Error("AoA must have at least one row");
        }
        return Math.max(...aoa[0].map((_, i_col) => {
            return aoa.reduce((sum, row) => {
                return sum + row[i_col].pe;
            }, 0);
        }));
    }
    return Math.max(...aoa.map((row) => {
        return Math.max(...row.map((cell) => Math.max(cell.pe, cell.ub ?? 0, cell.lb ?? 0)));
    }));
}
export function getMaxValuesFromSeries(series) {
    return {
        xMaxValue: Math.max(...series.map((ser) => {
            return Math.max(...ser.values.map((v) => Math.max(v.x.pe, v.x.ub ?? 0, v.x.lb ?? 0)));
        })),
        yMaxValue: Math.max(...series.map((ser) => {
            return Math.max(...ser.values.map((v) => Math.max(v.y.pe, v.y.ub ?? 0, v.y.lb ?? 0)));
        })),
    };
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export function getXScaleAxisTickLabelDimensions(ctx, s, scaleAxisTickLabels, scaleAxisLabelMaxWidth) {
    return scaleAxisTickLabels.map((label) => {
        return measureText(ctx, s.xScaleAxis.tickLabelFormatter(label), s.text.xScaleAxisTickLabels, scaleAxisLabelMaxWidth);
    });
}
export function getYScaleAxisTickLabelDimensions(ctx, s, scaleAxisTickLabels, scaleAxisLabelMaxWidth) {
    return scaleAxisTickLabels.map((label) => {
        return measureText(ctx, s.yScaleAxis.tickLabelFormatter(label), s.text.yScaleAxisTickLabels, scaleAxisLabelMaxWidth);
    });
}
export function getXTextAxisTickLabelDimensions(ctx, s, textAxisTickLabels, textAxisLabelMaxWidth) {
    return textAxisTickLabels.map((label) => {
        return measureText(ctx, s.textAxisTickLabelFormatter(label), s.text.xTextAxisTickLabels, textAxisLabelMaxWidth);
    });
}
export function getYTextAxisTickLabelDimensions(ctx, s, textAxisTickLabels, textAxisLabelMaxWidth) {
    return textAxisTickLabels.map((label) => {
        return measureText(ctx, s.textAxisTickLabelFormatter(label), s.text.yTextAxisTickLabels, textAxisLabelMaxWidth);
    });
}
export function getVerticalXTextAxisTickLabelDimensions(ctx, s, textAxisTickLabels, maxHeight) {
    return textAxisTickLabels.map((label) => {
        return measureVerticalText(ctx, s.textAxisTickLabelFormatter(label), s.text.xTextAxisTickLabels, maxHeight);
    });
}
export function getColGroupLabelDimensions(ctx, s, colGroupLabels, maxAllowableWidths) {
    return colGroupLabels.map((cg, i_cg) => {
        if (cg.display === false || !cg.label.trim()) {
            return undefined;
        }
        const maxWidth = maxAllowableWidths[i_cg];
        return measureText(ctx, cg.label, s.text.colGroupLabels, maxWidth);
    });
}
export function getVerticalColGroupLabelDimensions(ctx, s, colGroupLabels, maxAllowableWidths) {
    return colGroupLabels.map((cg, i_cg) => {
        if (cg.display === false || !cg.label.trim()) {
            return undefined;
        }
        const maxWidth = maxAllowableWidths[i_cg];
        return measureVerticalText(ctx, cg.label, s.text.colGroupLabels, maxWidth);
    });
}
export function getDataLabelDimensions(ctx, s, data) {
    return data.aoa.map((row, i_row) => {
        return row.map((cell, i_cell) => {
            const colHeader = data.colHeaders[i_cell];
            const rowHeader = data.rowHeaders[i_row];
            return measureText(ctx, s.dataLabelFormatter(cell.pe, {
                rowIndex: i_row,
                rowHeader,
                colIndex: i_cell,
                colHeader,
            }), s.text.dataLabels, Number.POSITIVE_INFINITY);
        });
    });
}
export function getDataLabelDimensionsSeries(ctx, s, series) {
    return series.map((ser) => {
        return ser.values.map((val) => {
            return val.label === undefined
                ? undefined
                : measureText(ctx, val.label, s.text.dataLabels, Number.POSITIVE_INFINITY);
        });
    });
}
export function getDataLabelMaxWidthAndHeight(dataLabelDimensions) {
    let dataLabelMaxW = 0;
    let dataLabelMaxH = 0;
    dataLabelDimensions.forEach((row) => {
        row.forEach((cell) => {
            dataLabelMaxW = Math.max(dataLabelMaxW, cell.dims.w());
            dataLabelMaxH = Math.max(dataLabelMaxH, cell.dims.h());
        });
    });
    return { dataLabelMaxW, dataLabelMaxH };
}
