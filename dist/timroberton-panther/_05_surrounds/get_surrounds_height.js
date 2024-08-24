import { measureLegend, measureText, } from "./deps.ts";
export function getSurroundsHeight(ctx, width, cs, caption, legendItems) {
    const sSurrounds = cs.getMergedSurroundsStyle();
    const innerW = width - sSurrounds.padding.totalPx();
    // Caption
    let captionAndCaptionGapH = 0;
    if (caption?.trim()) {
        const mCaption = measureText(ctx, caption.trim(), sSurrounds.text.caption, innerW);
        captionAndCaptionGapH = mCaption.dims.h() + sSurrounds.captionGap;
    }
    // Legend
    let legendAndLegendGapW = 0;
    let legendAndLegendGapH = 0;
    if (legendItems &&
        legendItems.length > 0 &&
        sSurrounds.legendPosition !== "none") {
        const sLegend = cs.getMergedLegendStyle();
        const mLegend = measureLegend(ctx, legendItems, sLegend);
        const isBottom = ["bottom-left", "bottom-center", "bottom-right"].includes(sSurrounds.legendPosition);
        const isRight = ["right-top", "right-center", "right-bottom"].includes(sSurrounds.legendPosition);
        legendAndLegendGapH = isBottom
            ? mLegend.dimensions.h() + sSurrounds.legendGap
            : 0;
        legendAndLegendGapW = isRight
            ? mLegend.dimensions.w() + sSurrounds.legendGap
            : 0;
    }
    return {
        contentW: width - legendAndLegendGapW,
        nonContentH: captionAndCaptionGapH +
            legendAndLegendGapH +
            sSurrounds.padding.totalPy(),
    };
}
