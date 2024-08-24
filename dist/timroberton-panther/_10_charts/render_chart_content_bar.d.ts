import type { MergedPaletteColors } from "./_style/mod.ts";
import type { TimChartDataColRowTransformed } from "./_types/mod.ts";
import { type MergedChartStyle, type RectCoordsDims } from "./deps.ts";
export declare function renderChartMainContentBar(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors): void;
