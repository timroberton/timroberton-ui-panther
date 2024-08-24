export function getOptionsFromObjOrPrevFunc(objOrPrevFunc, prev) {
    return isPrevFunc(objOrPrevFunc) ? objOrPrevFunc(prev) : objOrPrevFunc;
}
function isPrevFunc(objOrPrevFunc) {
    return typeof objOrPrevFunc === "function";
}
