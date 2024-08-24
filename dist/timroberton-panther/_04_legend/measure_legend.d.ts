import { Dimensions, type MeasuredText, type MergedLegendStyle } from "./deps.ts";
import type { LegendItem } from "./types.ts";
export type MeasuredLegend = {
    dimensions: Dimensions;
    groups: {
        allMeasuredLines: MeasuredText[];
        legendItemsThisGroup: LegendItem[];
        wThisGroupLabels: number;
    }[];
    colorBoxWidthOrPointWidth: number;
    s: MergedLegendStyle;
};
export declare function measureLegend(ctx: CanvasRenderingContext2D, legendItems: LegendItem[], s: MergedLegendStyle): MeasuredLegend;
