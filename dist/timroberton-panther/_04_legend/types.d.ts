import type { ColorKeyOrString, PointStyle } from "./deps";
export type LegendItem = {
    label: string;
    color: ColorKeyOrString;
    pointStyle?: PointStyle | "as-block";
};
