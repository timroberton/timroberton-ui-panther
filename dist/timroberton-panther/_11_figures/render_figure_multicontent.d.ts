import { RectCoordsDims, type MergedMultiContentStyle } from "./deps";
import { type TimFigureMultiContentInputs } from "./types";
export declare function renderMultiContent(ctx: CanvasRenderingContext2D, inputs: TimFigureMultiContentInputs, rpd: RectCoordsDims, s: MergedMultiContentStyle, responsiveScale: number | undefined, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): void;
