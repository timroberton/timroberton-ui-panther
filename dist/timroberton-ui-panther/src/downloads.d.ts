import { Csv } from "./deps";
export declare function downloadCsv<T>(csv: Csv<T> | string, filename?: string): void;
export declare function downloadJson(json: JSON, filename?: string): void;
