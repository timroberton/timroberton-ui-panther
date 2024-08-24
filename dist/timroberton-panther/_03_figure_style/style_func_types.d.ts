import type { UpperLabel } from "./types.ts";
import { type ColorKeyOrString } from "./deps.ts";
export type StyleFuncBoolean = (i_row: number, i_col: number, i_colGroup: number, i_colInColGroup: number) => boolean;
export type StyleFuncString = (i_row: number, i_col: number, i_colGroup: number, i_colInColGroup: number) => string;
export type StyleFuncColorKeyOrString = (i_row: number, i_col: number, i_colGroup: number, i_colInColGroup: number) => ColorKeyOrString;
export type StyleFuncUpperLabel = (i_row: number, i_col: number, i_colGroup: number, i_colInColGroup: number) => UpperLabel;
export declare function getStyleFuncString(val: ColorKeyOrString | StyleFuncColorKeyOrString): StyleFuncString;
export type CsvCellFormatterFunc<T extends string | number, R> = (value: T, cell: {
    rowIndex: number;
    rowHeader: string | "none";
    colIndex: number;
    colHeader: string | "none";
}) => R;
