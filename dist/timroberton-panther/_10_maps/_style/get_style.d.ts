import type { PixelVals } from "../_types/mod.ts";
import type { PaddingOptions, PointStyle, ColorKeyOrString } from "../deps.ts";
import type { TimMapStyleOptions, ValFuncOneArg, ValFuncTwoArgs } from "./map_style_options.ts";
export type TimMapStyle<FacValue, Adm1Value, Adm2Value> = {
    padding: PaddingOptions;
    backgroundColor: ColorKeyOrString | "none";
    filterPixels: undefined | ((pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => boolean);
    filterFacs: undefined | ((facValue: FacValue | undefined, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value>) => boolean);
    pixelColor: ValFuncOneArg<FacValue, Adm1Value, Adm2Value, ColorKeyOrString>;
    pixelTransparency255: undefined | ValFuncOneArg<FacValue, Adm1Value, Adm2Value, number>;
    pointColor: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, ColorKeyOrString>;
    pointStyle: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, PointStyle>;
    pointRadius: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, number>;
    pointStrokeWidth: ValFuncTwoArgs<FacValue, Adm1Value, Adm2Value, number>;
};
export declare function getMapStyle<FacValue, Adm1Value, Adm2Value>(cs?: TimMapStyleOptions<FacValue, Adm1Value, Adm2Value>): TimMapStyle<FacValue, Adm1Value, Adm2Value>;
