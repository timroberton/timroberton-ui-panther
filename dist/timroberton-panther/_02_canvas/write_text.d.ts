import type { MeasuredText } from "./measure_text.ts";
export declare function writeText(ctx: CanvasRenderingContext2D, mText: MeasuredText, x: number, y: number, align: "center" | "left" | "right"): void;
export declare function writeVerticalText(ctx: CanvasRenderingContext2D, mText: MeasuredText, x: number, y: number, verticalAlign: "top" | "center" | "bottom", horizontalAlign: "left" | "center" | "right", rotation: "anticlockwise" | "clockwise"): void;
