import type { Csv } from "./csv_class.ts";
export declare function csvsAreTheSame<T>(a: Csv<T>, b: Csv<T>, asNumbers?: "as-numbers"): boolean;