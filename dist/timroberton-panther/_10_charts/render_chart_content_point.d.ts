import type { MergedPaletteColors, MergedPalettePointStyles } from "./_style/mod";
import type { TimChartDataColRowTransformed } from "./_types/mod";
import { type MergedChartStyle, type RectCoordsDims } from "./deps";
export declare function renderChartMainContentPoint(ctx: CanvasRenderingContext2D, data: TimChartDataColRowTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles): void;
