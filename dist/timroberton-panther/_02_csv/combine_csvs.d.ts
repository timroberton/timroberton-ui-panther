import { Csv } from "./csv_class.ts";
export declare function combineCsvsUsingSingleRows<T>(csvArray: Csv<T>[], rowNumberOrHeader: number | string, newRowHeaders?: string[]): Csv<T>;
export declare function combineCsvsUsingSingleCols<T>(csvArray: Csv<T>[], colNumberOrHeader: number | string, newColHeaders?: string[]): Csv<T>;
