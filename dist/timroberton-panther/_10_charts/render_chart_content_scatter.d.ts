import type { MergedPaletteColors, MergedPalettePointStyles } from "./_style/mod.ts";
import type { TimChartDataXYTransformed } from "./_types/mod.ts";
import { type MergedChartStyle, type RectCoordsDims } from "./deps.ts";
export declare function renderChartMainContentScatter(ctx: CanvasRenderingContext2D, data: TimChartDataXYTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles): void;
