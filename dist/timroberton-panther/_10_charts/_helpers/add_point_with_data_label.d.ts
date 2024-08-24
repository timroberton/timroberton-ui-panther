import { type ColorKeyOrString, type MeasuredText, type MergedChartStyle, type PointStyle } from "../deps.ts";
export type RenderablePointWithDataLabel = {
    x: number;
    y: number;
    color: ColorKeyOrString;
    pointStyle: PointStyle;
    dataLabel?: {
        m: MeasuredText;
        position: "left" | "right" | "top" | "bottom";
        offsetX?: number;
        offsetY?: number;
    };
};
export declare function addPointWithDataLabel(ctx: CanvasRenderingContext2D, r: RenderablePointWithDataLabel, s: MergedChartStyle): void;
