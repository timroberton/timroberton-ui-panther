import { addLegend, writeText } from "./deps";
export function addSurrounds(ctx, mSurrounds) {
    if (mSurrounds.caption) {
        writeText(ctx, mSurrounds.caption.mCaption, mSurrounds.caption.rcd.x(), mSurrounds.caption.rcd.y(), "center");
        // ctx.fillStyle = "red";
        // ctx.fillRect(
        //   mSurrounds.caption.rcd.x(),
        //   mSurrounds.caption.rcd.y(),
        //   mSurrounds.caption.rcd.w(),
        //   mSurrounds.caption.rcd.h()
        // );
    }
    if (mSurrounds.legend) {
        addLegend(ctx, mSurrounds.legend.rcd.topLeftCoords(), mSurrounds.legend.mLegend);
    }
}
