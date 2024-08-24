///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export function isColContainerForLayout(item) {
    return item.cols !== undefined;
}
export function isRowContainerForLayout(item) {
    return item.rows !== undefined;
}
export function isMeasurableItem(item) {
    return (item.rows === undefined &&
        item.cols === undefined);
}
export function isColContainerWithLayout(item) {
    return item.cols !== undefined;
}
export function isRowContainerWithLayout(item) {
    return item.rows !== undefined;
}
export function isContainerInMeasurerFunc(item) {
    return (item.cols !== undefined ||
        item.rows !== undefined);
}
