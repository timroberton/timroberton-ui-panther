import { addLegend, writeText } from "./deps.ts";
export function addSurrounds(ctx, mSurrounds) {
    if (mSurrounds.caption) {
        writeText(ctx, mSurrounds.caption.mCaption, mSurrounds.caption.rcd.x(), mSurrounds.caption.rcd.y(), "left");
    }
    if (mSurrounds.legend) {
        addLegend(ctx, mSurrounds.legend.rcd.topLeftCoords(), mSurrounds.legend.mLegend);
    }
}
