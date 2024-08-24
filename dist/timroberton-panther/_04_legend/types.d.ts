import type { ColorKeyOrString, PointStyle } from "./deps.ts";
export type LegendItem = {
    label: string;
    color: ColorKeyOrString;
    pointStyle?: PointStyle | "as-block";
};
