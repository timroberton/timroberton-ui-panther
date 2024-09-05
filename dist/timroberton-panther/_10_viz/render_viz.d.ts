import { type CustomPositionStyle, type TimVizData } from "./_positions/mod";
import { type RectCoordsDims } from "./deps";
export type TimVizInputs = {
    vizType: "viz";
    vizData: TimVizData;
    vizStyle?: CustomPositionStyle;
};
export declare function renderViz(ctx: CanvasRenderingContext2D, inputs: TimVizInputs, rpd: RectCoordsDims): void;
