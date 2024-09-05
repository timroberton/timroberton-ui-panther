import { CustomFigureStyle, addSurrounds, assert, measureSurrounds, renderChart, renderMapBoundedDims, renderViz, } from "./deps";
import { renderMultiContent } from "./render_figure_multicontent";
import { renderRawImage } from "./render_raw_image_for_figure";
import { isChart, isMap, isMultiContent, isRawImage, isViz, } from "./types";
export function renderFigure(ctx, inputs, rcd, responsiveScale, canvasCreator) {
    if (isChart(inputs)) {
        renderChart(ctx, inputs, rcd);
        return;
    }
    if (isMap(inputs)) {
        renderMapBoundedDims(ctx, inputs, rcd, canvasCreator);
        return;
    }
    if (isViz(inputs)) {
        renderViz(ctx, inputs, rcd);
        return;
    }
    if (isRawImage(inputs)) {
        renderRawImage(ctx, inputs, rcd);
        return;
    }
    assert(isMultiContent(inputs), "Unknown figure inputs");
    const cs = new CustomFigureStyle(inputs.figureStyle, responsiveScale);
    const s = cs.getMergedMultiContentStyle();
    if (s.backgroundColor !== "none") {
        ctx.fillStyle = s.backgroundColor;
        ctx.fillRect(rcd.x(), rcd.y(), rcd.w(), rcd.h());
    }
    const mSurrounds = measureSurrounds(ctx, rcd, cs, inputs.caption, inputs.legendItems);
    renderMultiContent(ctx, inputs, mSurrounds.content.rcd, s, responsiveScale, canvasCreator);
    addSurrounds(ctx, mSurrounds);
}
