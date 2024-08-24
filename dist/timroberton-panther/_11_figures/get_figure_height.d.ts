import { type FigureHeightInfo, type TimFigureInputs } from "./types.ts";
export declare function getFigureHeight(ctx: CanvasRenderingContext2D, inputs: TimFigureInputs, width: number, responsiveScale: number | undefined, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): FigureHeightInfo;
