import { getChartDataColRowTransformed } from "./_helpers/get_chart_data_colrow_transformed.ts";
import { getChartDataXYTransformed } from "./_helpers/get_chart_data_xy_transformed.ts";
import { getLegendItemsColRow, getLegendItemsSankey, getLegendItemsXY, } from "./_helpers/get_legend_items.ts";
import { getMergedPaletteColorsColRow, getMergedPaletteColorsSankey, getMergedPaletteColorsXY, getMergedPalettePointStylesColRow, getMergedPalettePointStylesXY, } from "./_style/mod.ts";
import { CustomFigureStyle, getSurroundsHeight } from "./deps.ts";
import { getChartHeightContentBar } from "./get_chart_height_content_bar.ts";
import { getChartHeightContentPoint } from "./get_chart_height_content_point.ts";
export function getChartHeight(ctx, inputs, width, responsiveScale) {
    const cs = new CustomFigureStyle(inputs.chartStyle, responsiveScale);
    const s = cs.getMergedChartStyle();
    if (inputs.chartType === "sankey") {
        const paletteColors = getMergedPaletteColorsSankey(inputs.chartData, cs);
        const legendItems = getLegendItemsSankey(inputs.chartData, paletteColors);
        const surroundsHeightInfo = getSurroundsHeight(ctx, width, cs, inputs.caption, legendItems);
        const contentH = 100;
        return { ideal: surroundsHeightInfo.nonContentH + contentH };
    }
    if (inputs.chartType === "scatter") {
        const d = getChartDataXYTransformed(inputs.chartData, s.horizontal);
        const paletteColors = getMergedPaletteColorsXY(d, cs);
        const palettePointStyles = getMergedPalettePointStylesXY(d, cs);
        const legendItems = getLegendItemsXY(d, paletteColors, palettePointStyles);
        const surroundsHeightInfo = getSurroundsHeight(ctx, width, cs, inputs.caption, legendItems);
        const contentH = 100;
        return { ideal: surroundsHeightInfo.nonContentH + contentH };
    }
    const d = getChartDataColRowTransformed(inputs.chartData);
    const paletteColors = getMergedPaletteColorsColRow(d, cs);
    const palettePointStyles = getMergedPalettePointStylesColRow(d, cs);
    const legendItems = getLegendItemsColRow(d, s.legendItemsSource, paletteColors, inputs.chartType === "point" ? palettePointStyles : undefined);
    const surroundsHeightInfo = getSurroundsHeight(ctx, width, cs, inputs.caption, legendItems);
    if (inputs.chartType === "point") {
        const contentH = getChartHeightContentPoint(ctx, d, width, s);
        return { ideal: surroundsHeightInfo.nonContentH + contentH };
    }
    const contentH = getChartHeightContentBar(ctx, d, width, s);
    return { ideal: surroundsHeightInfo.nonContentH + contentH };
}
