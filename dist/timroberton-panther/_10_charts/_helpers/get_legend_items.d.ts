import type { MergedPaletteColors, MergedPalettePointStyles } from "../_style/mod.ts";
import type { TimChartDataColRowTransformed, TimChartDataSankey, TimChartDataXYTransformed } from "../_types/mod.ts";
import type { LegendItem, LegendItemsSource } from "../deps.ts";
export declare function getLegendItemsColRow(chartData: TimChartDataColRowTransformed, legendItemsSource: LegendItemsSource, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles | undefined): LegendItem[];
export declare function getLegendItemsXY(chartData: TimChartDataXYTransformed, paletteColors: MergedPaletteColors, palettePointStyles: MergedPalettePointStyles | undefined): LegendItem[];
export declare function getLegendItemsSankey(chartData: TimChartDataSankey, paletteColors: MergedPaletteColors): LegendItem[];
