import type { MergedPaletteColors } from "./_style/mod";
import type { TimChartDataColRowTransformed } from "./_types/mod";
import { type MergedChartStyle, type RectCoordsDims } from "./deps";
export declare function renderChartMainContentBar(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors): void;
