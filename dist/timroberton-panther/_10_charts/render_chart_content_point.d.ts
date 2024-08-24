import type { MergedPaletteColors, MergedPalettePointStyles } from "./_style/mod.ts";
import type { TimChartDataColRowTransformed } from "./_types/mod.ts";
import { type MergedChartStyle, type RectCoordsDims } from "./deps.ts";
export declare function renderChartMainContentPoint(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles): void;
