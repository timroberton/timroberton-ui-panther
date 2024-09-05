import type { MergedPaletteColors, MergedPalettePointStyles } from "./_style/mod";
import type { TimChartDataXYTransformed } from "./_types/mod";
import { type MergedChartStyle, type RectCoordsDims } from "./deps";
export declare function renderChartMainContentScatter(ctx: CanvasRenderingContext2D, data: TimChartDataXYTransformed, rpd: RectCoordsDims, s: MergedChartStyle, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles): void;
