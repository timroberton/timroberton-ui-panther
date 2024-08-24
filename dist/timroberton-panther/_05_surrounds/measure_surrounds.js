import { Coordinates, measureLegend, measureText, } from "./deps.ts";
export function measureSurrounds(ctx, rcd, cs, caption, legendItems) {
    const sSurrounds = cs.getMergedSurroundsStyle();
    const innerRcd = rcd.getPadded(sSurrounds.padding);
    // Caption
    let captionAndCaptionGapH = 0;
    let mCaption = undefined;
    let captionRcd = undefined;
    if (caption?.trim()) {
        mCaption = measureText(ctx, caption.trim(), sSurrounds.text.caption, innerRcd.w());
        captionAndCaptionGapH = mCaption.dims.h() + sSurrounds.captionGap;
        captionRcd = mCaption.dims.asRectCoordsDims(innerRcd.topLeftCoords());
    }
    const chartAndLegendRcd = innerRcd.getAdjusted((prev) => ({
        y: prev.y() + captionAndCaptionGapH,
        h: prev.h() - captionAndCaptionGapH,
    }));
    // Legend
    let legendAndLegendGapW = 0;
    let legendAndLegendGapH = 0;
    let mLegend = undefined;
    let legendRcd = undefined;
    if (legendItems &&
        legendItems.length > 0 &&
        sSurrounds.legendPosition !== "none") {
        const sLegend = cs.getMergedLegendStyle();
        mLegend = measureLegend(ctx, legendItems, sLegend);
        const isBottom = ["bottom-left", "bottom-center", "bottom-right"].includes(sSurrounds.legendPosition);
        const isRight = ["right-top", "right-center", "right-bottom"].includes(sSurrounds.legendPosition);
        legendAndLegendGapH = isBottom
            ? mLegend.dimensions.h() + sSurrounds.legendGap
            : 0;
        legendAndLegendGapW = isRight
            ? mLegend.dimensions.w() + sSurrounds.legendGap
            : 0;
        const x = chartAndLegendRcd.x() +
            (isRight
                ? chartAndLegendRcd.w() - mLegend.dimensions.w()
                : sSurrounds.legendPosition === "bottom-left"
                    ? 0
                    : sSurrounds.legendPosition === "bottom-center"
                        ? (chartAndLegendRcd.w() - mLegend.dimensions.w()) / 2
                        : chartAndLegendRcd.w() - mLegend.dimensions.w());
        const y = chartAndLegendRcd.y() +
            (isBottom
                ? chartAndLegendRcd.h() - mLegend.dimensions.h()
                : sSurrounds.legendPosition === "right-top"
                    ? 0
                    : sSurrounds.legendPosition === "right-center"
                        ? (chartAndLegendRcd.h() - mLegend.dimensions.h()) / 2
                        : chartAndLegendRcd.h() - mLegend.dimensions.h());
        legendRcd = mLegend.dimensions.asRectCoordsDims(new Coordinates({ x, y }));
    }
    const contentRcd = chartAndLegendRcd.getAdjusted((prev) => ({
        h: prev.h() - legendAndLegendGapH,
        w: prev.w() - legendAndLegendGapW,
    }));
    return {
        caption: captionRcd && mCaption
            ? {
                rcd: captionRcd,
                mCaption,
            }
            : undefined,
        content: {
            rcd: contentRcd,
        },
        legend: legendRcd && mLegend
            ? {
                rcd: legendRcd,
                mLegend,
            }
            : undefined,
        s: sSurrounds,
    };
}
