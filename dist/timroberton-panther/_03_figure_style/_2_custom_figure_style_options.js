import { assert, } from "./deps";
let _GS = undefined;
export function setGlobalFigureStyle(gs) {
    assert(_GS === undefined, "Global figure styles have already been set");
    _GS = gs;
}
export function getGlobalFigureStyle() {
    return _GS ?? {};
}
