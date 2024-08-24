import { getChartDataColRowTransformed } from "./_helpers/get_chart_data_colrow_transformed.ts";
import { getChartDataXYTransformed } from "./_helpers/get_chart_data_xy_transformed.ts";
import { getLegendItemsColRow, getLegendItemsSankey, getLegendItemsXY, } from "./_helpers/get_legend_items.ts";
import { getMergedPaletteColorsColRow, getMergedPaletteColorsSankey, getMergedPaletteColorsXY, getMergedPalettePointStylesColRow, getMergedPalettePointStylesXY, } from "./_style/mod.ts";
import { CustomFigureStyle, addSurrounds, measureSurrounds, } from "./deps.ts";
import { renderChartMainContentBar } from "./render_chart_content_bar.ts";
import { renderChartMainContentPoint } from "./render_chart_content_point.ts";
import { renderChartMainContentSankey } from "./render_chart_content_sankey.ts";
import { renderChartMainContentScatter } from "./render_chart_content_scatter.ts";
export function renderChart(ctx, inputs, rcd, responsiveScale) {
    const cs = new CustomFigureStyle(inputs.chartStyle, responsiveScale);
    const s = cs.getMergedChartStyle();
    if (s.backgroundColor !== "none") {
        ctx.fillStyle = s.backgroundColor;
        ctx.fillRect(rcd.x(), rcd.y(), rcd.w(), rcd.h());
    }
    if (inputs.chartType === "sankey") {
        const paletteColors = getMergedPaletteColorsSankey(inputs.chartData, cs);
        const legendItems = getLegendItemsSankey(inputs.chartData, paletteColors);
        const mSurrounds = measureSurrounds(ctx, rcd, cs, inputs.caption, legendItems);
        renderChartMainContentSankey(ctx, inputs.chartData, mSurrounds.content.rcd, s);
        addSurrounds(ctx, mSurrounds);
        return;
    }
    if (inputs.chartType === "scatter") {
        const d = getChartDataXYTransformed(inputs.chartData, s.horizontal);
        const paletteColors = getMergedPaletteColorsXY(d, cs);
        const palettePointStyles = getMergedPalettePointStylesXY(d, cs);
        const legendItems = getLegendItemsXY(d, paletteColors, palettePointStyles);
        const mSurrounds = measureSurrounds(ctx, rcd, cs, inputs.caption, legendItems);
        renderChartMainContentScatter(ctx, d, mSurrounds.content.rcd, s, paletteColors, palettePointStyles);
        addSurrounds(ctx, mSurrounds);
        return;
    }
    const d = getChartDataColRowTransformed(inputs.chartData);
    const paletteColors = getMergedPaletteColorsColRow(d, cs);
    const palettePointStyles = getMergedPalettePointStylesColRow(d, cs);
    const legendItems = getLegendItemsColRow(d, s.legendItemsSource, paletteColors, inputs.chartType === "point" ? palettePointStyles : undefined);
    const mSurrounds = measureSurrounds(ctx, rcd, cs, inputs.caption, legendItems);
    if (inputs.chartType === "bar") {
        renderChartMainContentBar(ctx, d, mSurrounds.content.rcd, s, paletteColors);
    }
    if (inputs.chartType === "point") {
        renderChartMainContentPoint(ctx, d, mSurrounds.content.rcd, s, paletteColors, palettePointStyles);
    }
    addSurrounds(ctx, mSurrounds);
}
