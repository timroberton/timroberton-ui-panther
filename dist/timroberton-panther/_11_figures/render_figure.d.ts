import { type RectCoordsDims } from "./deps";
import { type TimFigureInputs } from "./types";
export declare function renderFigure(ctx: CanvasRenderingContext2D, inputs: TimFigureInputs, rcd: RectCoordsDims, responsiveScale: number | undefined, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): void;
