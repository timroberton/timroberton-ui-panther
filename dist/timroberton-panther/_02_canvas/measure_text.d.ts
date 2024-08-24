import { Dimensions, type TextInfoUnkeyed } from "./deps.ts";
export type MeasuredText = {
    lines: MeasuredLine[];
    dims: Dimensions;
    ti: TextInfoUnkeyed;
};
type MeasuredLine = {
    text: string;
    w: number;
    y: number;
};
export declare function measureText(ctx: CanvasRenderingContext2D, text: string, ti: TextInfoUnkeyed, maxWidth: number): MeasuredText;
export declare function measureVerticalText(ctx: CanvasRenderingContext2D, text: string, ti: TextInfoUnkeyed, maxHeight: number): MeasuredText;
export {};
