import { type MergedMultiContentStyle } from "./deps.ts";
import type { TimFigureMultiContentInputs } from "./types.ts";
export declare function getFigureHeightMultiContent(ctx: CanvasRenderingContext2D, inputs: TimFigureMultiContentInputs, width: number, s: MergedMultiContentStyle, responsiveScale: number | undefined, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): number;
