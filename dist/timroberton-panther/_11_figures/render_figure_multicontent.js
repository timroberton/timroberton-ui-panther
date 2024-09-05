import { RectCoordsDims, measureText, renderChart, renderMapBoundedDims, renderViz, writeText, } from "./deps";
import { getFigureHeight } from "./get_figure_height";
import { getRowsOfSingleContent } from "./get_rows_of_single_content";
import { renderRawImage } from "./render_raw_image_for_figure";
import { isChart, isMap, isViz, } from "./types";
export function renderMultiContent(ctx, inputs, rpd, s, responsiveScale, canvasCreator) {
    // Chart
    let currentX = rpd.x();
    let currentY = rpd.y();
    const rowsOfSingleContent = getRowsOfSingleContent(inputs.multiContent, s.nPerRow, s.nSlotsToSkip ?? 0);
    const nChartRows = rowsOfSingleContent.length;
    const singleW = (rpd.w() - (s.nPerRow - 1) * s.subChartGapX) / s.nPerRow;
    // Measuring subtitles
    let totalSubtitleAndCaptionGapHeights = 0;
    const allMs = rowsOfSingleContent.map((rowOfSingleContent) => {
        let maxLabelHForRow = 0;
        const rowMs = rowOfSingleContent.map((c) => {
            if (c === "blank") {
                return "blank";
            }
            const m = measureText(ctx, c.subCaption, s.text.subCaption, singleW);
            maxLabelHForRow = Math.max(maxLabelHForRow, m.dims.h());
            return m;
        });
        totalSubtitleAndCaptionGapHeights += maxLabelHForRow + s.subCaptionGap;
        return { maxLabelHForRow, rowMs };
    });
    const singleRowH = (rpd.h() -
        ((nChartRows - 1) * s.subChartGapY + totalSubtitleAndCaptionGapHeights)) /
        nChartRows;
    for (let i = 0; i < rowsOfSingleContent.length; i++) {
        const rowOfSingleContent = rowsOfSingleContent[i];
        const { maxLabelHForRow, rowMs } = allMs[i];
        let maxContentHeightThisRow = 0;
        for (let j = 0; j < rowOfSingleContent.length; j++) {
            const c = rowOfSingleContent[j];
            const m = rowMs[j];
            if (c === "blank" || m === "blank") {
                currentX += singleW + s.subChartGapX;
                continue;
            }
            const contentH = s.logicContentHeights === "equal"
                ? singleRowH
                : getFigureHeight(ctx, c.content, singleW, responsiveScale, canvasCreator).ideal;
            const thisSubTitleYOffset = maxLabelHForRow - m.dims.h();
            writeText(ctx, m, currentX, currentY + thisSubTitleYOffset, "left");
            const finalInnerRcd = new RectCoordsDims({
                x: currentX,
                y: currentY + maxLabelHForRow + s.subCaptionGap,
                w: Math.floor(singleW),
                h: Math.floor(contentH),
            });
            if (isChart(c.content)) {
                renderChart(ctx, c.content, finalInnerRcd);
            }
            else if (isMap(c.content)) {
                renderMapBoundedDims(ctx, c.content, finalInnerRcd, canvasCreator);
            }
            else if (isViz(c.content)) {
                renderViz(ctx, c.content, finalInnerRcd);
            }
            else {
                renderRawImage(ctx, c.content, finalInnerRcd);
            }
            maxContentHeightThisRow = Math.max(maxContentHeightThisRow, contentH);
            currentX += singleW + s.subChartGapX;
        }
        currentX = rpd.x();
        currentY +=
            maxLabelHForRow +
                s.subCaptionGap +
                maxContentHeightThisRow +
                s.subChartGapY;
    }
}
