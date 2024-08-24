export function getColHeight(colGroup, nRows, s) {
    const colHeight = (nRows * s.yTextAxis.colHeight) / s.pctOfCol + s.gridStrokeWidth;
    return colGroup.cols.length * colHeight;
}
