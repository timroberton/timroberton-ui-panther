import { type CustomPositionStyle, type TimVizData } from "./_positions/mod.ts";
import { type RectCoordsDims } from "./deps.ts";
export type TimVizInputs = {
    vizType: "viz";
    vizData: TimVizData;
    vizStyle?: CustomPositionStyle;
};
export declare function renderViz(ctx: CanvasRenderingContext2D, inputs: TimVizInputs, rpd: RectCoordsDims): void;
