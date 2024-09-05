import type { PaddingOptions, PointStyle, ColorKeyOrString } from "../deps";
import type { ValFuncOneArg, ValFuncTwoArgs } from "./map_style_options";
export declare const _DEFAULT_STYLES: {
    padding: PaddingOptions;
    backgroundColor: ColorKeyOrString;
    filterPixels: any;
    filterFacs: any;
    pixelColor: ValFuncOneArg<unknown, unknown, unknown, ColorKeyOrString>;
    pixelTransparency255: ValFuncOneArg<unknown, unknown, unknown, number>;
    pointColor: ValFuncTwoArgs<unknown, unknown, unknown, ColorKeyOrString>;
    pointStyle: ValFuncTwoArgs<unknown, unknown, unknown, PointStyle>;
    pointRadius: ValFuncTwoArgs<unknown, unknown, unknown, number>;
    pointStrokeWidth: ValFuncTwoArgs<unknown, unknown, unknown, number>;
};
