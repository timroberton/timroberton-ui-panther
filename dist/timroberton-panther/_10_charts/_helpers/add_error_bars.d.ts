import { type ColorKeyOrString, type MergedChartStyle } from "../deps.ts";
export type RenderableVerticalErrorBars = {
    x: number;
    t: number;
    b: number;
    w: number;
    color: ColorKeyOrString;
    horizontal: boolean;
};
export declare function addErrorBars(ctx: CanvasRenderingContext2D, r: RenderableVerticalErrorBars, s: MergedChartStyle): void;
