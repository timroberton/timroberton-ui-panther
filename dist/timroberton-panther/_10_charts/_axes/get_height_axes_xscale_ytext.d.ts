import type { ColGroupExpanded, TimChartDataColRowTransformed } from "../_types/mod.ts";
import { type MergedChartStyle } from "../deps.ts";
export declare function getHeightAxesXScaleYText(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, w: number, s: MergedChartStyle): {
    colGroups: ColGroupExpanded[];
    nonContentH: number;
};
