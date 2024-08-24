import { getColor } from "./deps.ts";
export function getStyleFuncString(val) {
    if (typeof val !== "function") {
        const color = getColor(val);
        return () => color;
    }
    return (i_row, i_col, i_colGroup, i_colInColGroup) => getColor(val(i_row, i_col, i_colGroup, i_colInColGroup));
}
