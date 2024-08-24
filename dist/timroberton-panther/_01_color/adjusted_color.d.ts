import type { ColorKeyOrString } from "./types.ts";
export type ColorAdjustmentStrategy = ColorAdjustmentStrategyOpacity | ColorAdjustmentStrategyBrighten | ColorAdjustmentStrategyDarken | ColorKeyOrString;
type ColorAdjustmentStrategyOpacity = {
    opacity: number;
};
type ColorAdjustmentStrategyBrighten = {
    brighten: number;
};
type ColorAdjustmentStrategyDarken = {
    darken: number;
};
export declare function getAdjustedColor(color: ColorKeyOrString, strategy: ColorAdjustmentStrategy): string;
export {};
