///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export function isFigure(content) {
    return (isChart(content) ||
        isMap(content) ||
        isViz(content) ||
        isRawImage(content) ||
        isMultiContent(content));
}
export function isChart(content) {
    return content.chartType !== undefined;
}
export function isMap(content) {
    return (content.mapType !== undefined);
}
export function isViz(content) {
    return content.vizType !== undefined;
}
export function isRawImage(content) {
    return content.image !== undefined;
}
export function isMultiContent(content) {
    return content.figureType !== undefined;
}
