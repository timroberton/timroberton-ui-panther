import { type RectCoordsDims } from "./deps.ts";
import { type TimFigureInputs } from "./types.ts";
export declare function renderFigure(ctx: CanvasRenderingContext2D, inputs: TimFigureInputs, rcd: RectCoordsDims, responsiveScale: number | undefined, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): void;
