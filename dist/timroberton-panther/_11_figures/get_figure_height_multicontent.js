import { measureText, sum } from "./deps.ts";
import { getFigureHeight } from "./get_figure_height.ts";
import { getRowsOfSingleContent } from "./get_rows_of_single_content.ts";
export function getFigureHeightMultiContent(ctx, inputs, width, s, responsiveScale, canvasCreator) {
    const singleW = (width - (s.nPerRow - 1) * s.subChartGapX) / s.nPerRow;
    const rowsOfSingleContent = getRowsOfSingleContent(inputs.multiContent, s.nPerRow, s.nSlotsToSkip ?? 0);
    const rowHeights = rowsOfSingleContent.map((row) => {
        const chartHeightsThisRow = row.map((c) => {
            if (c === "blank") {
                return 0;
            }
            const m = measureText(ctx, c.subCaption, s.text.subCaption, singleW);
            const chartH = getFigureHeight(ctx, c.content, singleW, responsiveScale, canvasCreator);
            return m.dims.h() + s.subCaptionGap + chartH.ideal;
        });
        return Math.max(...chartHeightsThisRow);
    });
    return sum(rowHeights) + (rowsOfSingleContent.length - 1) * s.subChartGapY;
}
