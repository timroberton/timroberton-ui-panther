///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export function getStyleValOrFuncValOneArg(valOrFunc, pixelVals) {
    if (typeof valOrFunc === "function") {
        return valOrFunc(pixelVals);
    }
    return valOrFunc;
}
export function getStyleValOrFuncValTwoArgs(valOrFunc, facValue, pixelVals) {
    if (typeof valOrFunc === "function") {
        return valOrFunc(facValue, pixelVals);
    }
    return valOrFunc;
}
