export { assert, assertNotUndefined, sum } from "../_00_utils/mod.ts";
export { getColor, type ColorKeyOrString } from "../_01_color/mod.ts";
export { getFont, type FontInfo, type FontKeyOrFontInfo, } from "../_01_font/mod.ts";
export { Padding, RectCoordsDims, type CoordsOffset, type PaddingOptions, } from "../_01_geometry/mod.ts";
export { _POINT_STYLES, addPoint, getPointStyle, measureText, writeText, type MeasuredText, type PointStyle, } from "../_02_canvas/mod.ts";
export { CustomFigureStyle, type CustomFigureStyleOptions, type MergedChartStyle, type MergedMultiContentStyle, type StyleFuncString, type StyleFuncUpperLabel, } from "../_03_figure_style/mod.ts";
export { type LegendItem } from "../_04_legend/mod.ts";
export { addSurrounds, measureSurrounds, getSurroundsHeight, } from "../_05_surrounds/mod.ts";
export { getChartHeight, renderChart, type TimChartInputs, type ChartHeightInfo, } from "../_10_charts/mod.ts";
export { renderMapBoundedDims, type TimMapInputs } from "../_10_maps/mod.ts";
export { renderViz, type TimVizInputs } from "../_10_viz/mod.ts";