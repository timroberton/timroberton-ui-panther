import type { Coords } from "../_types/mod";
import { type ColorKeyOrString, type MergedChartStyle, type UpperLabel } from "../deps";
export declare function addCascadeArrow(ctx: CanvasRenderingContext2D, from: Coords, to: Coords, label: number | undefined, fromBarCenterX: number, toBarCenterX: number, arrowColor: ColorKeyOrString, upperLabel: UpperLabel | undefined, chartAreaY: number, s: MergedChartStyle): void;
export declare function getHeightOfUpperLabelBox(ctx: CanvasRenderingContext2D, upperLabel: UpperLabel, w: number, s: MergedChartStyle): number;
