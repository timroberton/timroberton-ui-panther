import type { ItemOrContainerForLayout } from "./types";
type ColWidthInfo = {
    w: number;
    span: number;
};
export declare function getColWidths<U>(cols: (ItemOrContainerForLayout<U> & {
    span?: number;
})[], width: number, _NUMBER_OF_COLUMNS: number, gapX: number): ColWidthInfo[];
export {};
