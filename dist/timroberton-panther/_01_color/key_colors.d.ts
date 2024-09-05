import { type ColorOptions, type ColorRgb } from "./color_class";
import type { ColorKeyOrString, KeyColors } from "./types";
export declare function setKeyColors(kc: KeyColors): void;
export declare function getColor(colorKey: ColorKeyOrString): string;
export declare function getColorAsRgb(colorKey: ColorKeyOrString): ColorRgb;
export declare function generateKeyColors(color: ColorOptions, nForContrast: number, whiteStartIndex: number, blackStartIndex: number): KeyColors;
