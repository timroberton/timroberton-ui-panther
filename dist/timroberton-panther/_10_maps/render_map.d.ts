import type { TimMapInputs } from "./_types/mod";
import { Coordinates, type RectCoordsDims } from "./deps";
export declare function renderMapBoundedDims<FacValue, Adm1Value, Adm2Value>(ctx: CanvasRenderingContext2D, inputs: TimMapInputs<FacValue, Adm1Value, Adm2Value>, rcd: RectCoordsDims, canvasCreator?: (w: number, h: number) => HTMLCanvasElement): void;
export declare function renderMapExactDims<FacValue, Adm1Value, Adm2Value>(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, inputs: TimMapInputs<FacValue, Adm1Value, Adm2Value>, outerRcd: RectCoordsDims, coords: Coordinates): void;
