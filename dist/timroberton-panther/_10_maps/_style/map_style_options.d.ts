import type { PixelVals } from "../_types/mod";
import type { ColorKeyOrString, PaddingOptions, PointStyle } from "../deps";
export type TimMapStyleOptions<FacValue, Adm1Value, Adm2Value> = {
    padding?: PaddingOptions;
    backgroundColor?: ColorKeyOrString | "none";
    filterPixels?: (pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => boolean;
    filterFacs?: (facValue: FacValue | undefined, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => boolean;
    pixelColor?: ValFuncOneArg<FacValue, Adm1Value, Adm2Value, ColorKeyOrString>;
    pixelTransparency255?: ValFuncOneArg<FacValue, Adm1Value, Adm2Value, number>;
    pointColor?: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, ColorKeyOrString>;
    pointStyle?: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, PointStyle>;
    pointRadius?: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, number>;
    pointStrokeWidth?: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, number>;
};
export type ValFuncOneArg<FacValue, Adm1Value, Adm2Value, T> = T | ((pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => T);
export type ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, T> = T | ((facValue: FacValue | undefined, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => T);
export declare function getStyleValOrFuncValOneArg<FacValue, Adm1Value, Adm2Value, T>(valOrFunc: ValFuncOneArg<FacValue, Adm1Value, Adm2Value, T>, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>): T;
export declare function getStyleValOrFuncValTwoArgs<FacValue, Adm1Value, Adm2Value, T>(valOrFunc: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, T>, facValue: FacValue | undefined, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>): T;
