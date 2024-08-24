import { CustomFigureStyle, getChartHeight, getSurroundsHeight, } from "./deps.ts";
import { getFigureHeightMultiContent } from "./get_figure_height_multicontent.ts";
import { isChart, isMultiContent, } from "./types.ts";
export function getFigureHeight(ctx, inputs, width, responsiveScale, canvasCreator) {
    if (isChart(inputs)) {
        return getChartHeight(ctx, inputs, width, responsiveScale);
    }
    if (isMultiContent(inputs)) {
        const cs = new CustomFigureStyle(inputs.figureStyle, responsiveScale);
        const s = cs.getMergedMultiContentStyle();
        const surroundsHeightInfo = getSurroundsHeight(ctx, width, cs, inputs.caption, inputs.legendItems);
        const contentH = getFigureHeightMultiContent(ctx, inputs, width, s, responsiveScale, canvasCreator);
        return { ideal: surroundsHeightInfo.nonContentH + contentH };
    }
    return { ideal: 500 };
}
