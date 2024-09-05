import { RectCoordsDims, assert, assertNotUndefined, getColor, measureText, toPct1, writeText, } from "./deps";
export function renderChartMainContentSankey(ctx, data, rpd, s) {
    const { x, y, w, h } = rpd.asObject();
    if (data.cols.length === 0) {
        throw new Error("Not enough cols");
    }
    const sumOfItemStuff = data.cols.length * s.sankey.itemWidth;
    const colGap = (w - sumOfItemStuff) / (data.cols.length - 1);
    /////////////////////////////////////////////////////////////////////////////////
    //   ______               __                                  __               //
    //  /      \             /  |                                /  |              //
    // /$$$$$$  |  ______   _$$ |_           ______    _______  _$$ |_    _______  //
    // $$ | _$$/  /      \ / $$   |         /      \  /       |/ $$   |  /       | //
    // $$ |/    |/$$$$$$  |$$$$$$/         /$$$$$$  |/$$$$$$$/ $$$$$$/  /$$$$$$$/  //
    // $$ |$$$$ |$$    $$ |  $$ | __       $$ |  $$ |$$ |        $$ | __$$      \  //
    // $$ \__$$ |$$$$$$$$/   $$ |/  |      $$ |__$$ |$$ \_____   $$ |/  |$$$$$$  | //
    // $$    $$/ $$       |  $$  $$/       $$    $$/ $$       |  $$  $$//     $$/  //
    //  $$$$$$/   $$$$$$$/    $$$$/        $$$$$$$/   $$$$$$$/    $$$$/ $$$$$$$/   //
    //                                     $$ |                                    //
    //                                     $$ |                                    //
    //                                     $$/                                     //
    //                                                                             //
    /////////////////////////////////////////////////////////////////////////////////
    const itemHeights = new Map();
    // Figure out item pcts
    data.cols.forEach((col, i_col) => {
        col.items.forEach((item) => {
            const labelM = item.label
                ? measureText(ctx, item.label, s.text.sankeyLabels, item.maxLabelWidth ?? s.sankey.itemWidth)
                : undefined;
            if (i_col === 0) {
                itemHeights.set(item.id, {
                    labelM,
                    pctVal: item.pctOfStarting ?? 1,
                    labelAndGapHeight: (labelM?.dims.h() ?? 0) + (labelM ? s.sankey.labelBottomGap : 0),
                });
                return;
            }
            const itemHeight = {
                labelM,
                pctVal: 0,
                labelAndGapHeight: (labelM?.dims.h() ?? 0) + (labelM ? s.sankey.labelBottomGap : 0),
            };
            data.streams.forEach((stream) => {
                if (stream.to === item.id) {
                    const fromItemHeight = itemHeights.get(stream.from);
                    assertNotUndefined(fromItemHeight, `Stream from item not defined ${stream.from}`);
                    itemHeight.pctVal += stream.pctOfFrom * fromItemHeight.pctVal;
                }
            });
            itemHeights.set(item.id, itemHeight);
        });
    });
    // Filter non-zero items
    const colsNonZero = data.cols.map((col) => {
        const items = col.items.filter((item) => {
            const itemHeight = itemHeights.get(item.id);
            assertNotUndefined(itemHeight);
            return itemHeight.pctVal > 0;
        });
        assert(items.length > 0, "Need to have at least one non-zero item in each col");
        return { items };
    });
    // Filter non-zero streams
    const streamsNonZero = data.streams.filter((stream) => {
        const from = itemHeights.get(stream.from);
        const to = itemHeights.get(stream.to);
        return (stream.pctOfFrom > 0 && from && from.pctVal > 0 && to && to.pctVal > 0);
    });
    ///////////////////////////////////////////////////////////////////////////////
    //  __       __                                                              //
    // /  \     /  |                                                             //
    // $$  \   /$$ |  ______    ______    _______  __    __   ______    ______   //
    // $$$  \ /$$$ | /      \  /      \  /       |/  |  /  | /      \  /      \  //
    // $$$$  /$$$$ |/$$$$$$  | $$$$$$  |/$$$$$$$/ $$ |  $$ |/$$$$$$  |/$$$$$$  | //
    // $$ $$ $$/$$ |$$    $$ | /    $$ |$$      \ $$ |  $$ |$$ |  $$/ $$    $$ | //
    // $$ |$$$/ $$ |$$$$$$$$/ /$$$$$$$ | $$$$$$  |$$ \__$$ |$$ |      $$$$$$$$/  //
    // $$ | $/  $$ |$$       |$$    $$ |/     $$/ $$    $$/ $$ |      $$       | //
    // $$/      $$/  $$$$$$$/  $$$$$$$/ $$$$$$$/   $$$$$$/  $$/        $$$$$$$/  //
    //                                                                           //
    ///////////////////////////////////////////////////////////////////////////////
    const firstItemPositions = getItemPositions(colsNonZero, h * 0.5, itemHeights, data.alignments, s, x, y, colGap);
    //////////////////////////////
    //  ________  __    __      //
    // /        |/  |  /  |     //
    // $$$$$$$$/ $$/  _$$ |_    //
    // $$ |__    /  |/ $$   |   //
    // $$    |   $$ |$$$$$$/    //
    // $$$$$/    $$ |  $$ | __  //
    // $$ |      $$ |  $$ |/  | //
    // $$ |      $$ |  $$  $$/  //
    // $$/       $$/    $$$$/   //
    //                          //
    //////////////////////////////
    let maxNonRectH = 0;
    let maxBottomY = 0;
    colsNonZero.forEach((col) => {
        let nonRectH = 0;
        col.items.forEach((item, i_item, arr) => {
            const isLast = i_item === arr.length - 1;
            const itemHeight = itemHeights.get(item.id);
            assertNotUndefined(itemHeight);
            const itemPosition = firstItemPositions.get(item.id);
            assertNotUndefined(itemPosition);
            nonRectH += itemHeight.labelAndGapHeight;
            if (!isLast) {
                const gapBelow = item.gapBelowOverride ?? s.sankey.itemGap;
                nonRectH += gapBelow;
            }
            maxBottomY = Math.max(maxBottomY, itemPosition.bottomY());
        });
        maxNonRectH = Math.max(maxNonRectH, nonRectH);
    });
    const currentContent = maxBottomY - y - maxNonRectH;
    const idealContent = h - maxNonRectH;
    const scaleFactor = idealContent / currentContent;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  _______                                                                                               //
    // /       \                                                                                              //
    // $$$$$$$  |  ______           _____  ____    ______    ______    _______  __    __   ______    ______   //
    // $$ |__$$ | /      \  ______ /     \/    \  /      \  /      \  /       |/  |  /  | /      \  /      \  //
    // $$    $$< /$$$$$$  |/      |$$$$$$ $$$$  |/$$$$$$  | $$$$$$  |/$$$$$$$/ $$ |  $$ |/$$$$$$  |/$$$$$$  | //
    // $$$$$$$  |$$    $$ |$$$$$$/ $$ | $$ | $$ |$$    $$ | /    $$ |$$      \ $$ |  $$ |$$ |  $$/ $$    $$ | //
    // $$ |  $$ |$$$$$$$$/         $$ | $$ | $$ |$$$$$$$$/ /$$$$$$$ | $$$$$$  |$$ \__$$ |$$ |      $$$$$$$$/  //
    // $$ |  $$ |$$       |        $$ | $$ | $$ |$$       |$$    $$ |/     $$/ $$    $$/ $$ |      $$       | //
    // $$/   $$/  $$$$$$$/         $$/  $$/  $$/  $$$$$$$/  $$$$$$$/ $$$$$$$/   $$$$$$/  $$/        $$$$$$$/  //
    //                                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const secondItemPositions = getItemPositions(colsNonZero, h * 0.5 * scaleFactor, itemHeights, data.alignments, s, x, y, colGap);
    //////////////////////////////////////////////////////////////////
    //  _______                             __                      //
    // /       \                           /  |                     //
    // $$$$$$$  |  ______   _______    ____$$ |  ______    ______   //
    // $$ |__$$ | /      \ /       \  /    $$ | /      \  /      \  //
    // $$    $$< /$$$$$$  |$$$$$$$  |/$$$$$$$ |/$$$$$$  |/$$$$$$  | //
    // $$$$$$$  |$$    $$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$ |  $$/  //
    // $$ |  $$ |$$$$$$$$/ $$ |  $$ |$$ \__$$ |$$$$$$$$/ $$ |       //
    // $$ |  $$ |$$       |$$ |  $$ |$$    $$ |$$       |$$ |       //
    // $$/   $$/  $$$$$$$/ $$/   $$/  $$$$$$$/  $$$$$$$/ $$/        //
    //                                                              //
    //////////////////////////////////////////////////////////////////
    // Render items
    colsNonZero.forEach((col) => {
        col.items.forEach((item) => {
            const itemHeight = itemHeights.get(item.id);
            assertNotUndefined(itemHeight);
            const itemPosition = secondItemPositions.get(item.id);
            assertNotUndefined(itemPosition);
            if (itemHeight.labelM) {
                if (!item.invisibleLabel) {
                    writeText(ctx, itemHeight.labelM, itemPosition.x() +
                        (item.labelAlign === "right" ? s.sankey.itemWidth : 0), itemPosition.y() - itemHeight.labelAndGapHeight, item.labelAlign ?? "left");
                }
            }
            ctx.fillStyle = getColor(item.color ?? "black");
            ctx.fillRect(itemPosition.x(), itemPosition.y(), itemPosition.w(), itemPosition.h());
            if (s.withDataLabels && item.showPctLabel !== false) {
                const mPct = measureText(ctx, toPct1(itemHeight.pctVal), s.text.sankeyLabels, s.sankey.itemWidth);
                const labelOffsetY = (itemPosition.h() - mPct.dims.h()) / 2;
                if (labelOffsetY >= 0) {
                    writeText(ctx, mPct, itemPosition.centerX(), itemPosition.y() + labelOffsetY, "center");
                }
            }
        });
    });
    // Render streams
    const itemOffsetOutgoingMap = {};
    const itemOffsetIncomingMap = {};
    streamsNonZero.forEach((stream) => {
        const fromItemPosition = secondItemPositions.get(stream.from);
        assertNotUndefined(fromItemPosition, `Stream from item not defined ${JSON.stringify(stream)}`);
        const toItemPosition = secondItemPositions.get(stream.to);
        assertNotUndefined(toItemPosition, `Stream to item not defined ${JSON.stringify(stream)}`);
        const streamH = stream.pctOfFrom * fromItemPosition.h();
        const offsetOutgoing = itemOffsetOutgoingMap[stream.from] ?? 0;
        const offsetIncoming = itemOffsetIncomingMap[stream.to] ?? 0;
        const fromX = Math.round(fromItemPosition.rightX());
        const toX = Math.round(toItemPosition.x());
        const fromYT = Math.round(fromItemPosition.y() + offsetOutgoing);
        const toYT = Math.round(toItemPosition.y() + offsetIncoming);
        const fromYB = Math.round(fromYT + streamH);
        const toYB = Math.round(toYT + streamH);
        const midX = Math.round((fromX + toX) / 2);
        ctx.fillStyle = getColor(stream.color);
        ctx.beginPath();
        ctx.moveTo(fromX, fromYT);
        ctx.bezierCurveTo(midX, fromYT, midX, toYT, toX, toYT);
        ctx.lineTo(toX, toYB);
        ctx.bezierCurveTo(midX, toYB, midX, fromYB, fromX, fromYB);
        ctx.closePath();
        ctx.fill();
        itemOffsetOutgoingMap[stream.from] =
            (itemOffsetOutgoingMap[stream.from] ?? 0) + streamH;
        itemOffsetIncomingMap[stream.to] =
            (itemOffsetIncomingMap[stream.to] ?? 0) + streamH;
    });
    // // Figure out stretch multiplier
    // let stretchMultiplier = Number.POSITIVE_INFINITY;
    // colsNonZero.forEach((col, i_col) => {
    //   const extraH = h - totalColH;
    //   const colStretchMultiplier = (totalColSumItemH + extraH) / totalColSumItemH;
    //   if (colStretchMultiplier <= 0) {
    //     throw new Error("Figure needs to be taller to accommodate all items");
    //   }
    //   stretchMultiplier = Math.min(stretchMultiplier, colStretchMultiplier);
    // });
    // // Apply stretch multipler
    // data.cols.forEach((col) => {
    //   col.items.forEach((item) => {
    //     itemHeights[item.id]!.itemH *= stretchMultiplier;
    //   });
    // });
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// function getRectRcpFromHeightAndPosition(
//   itemHeight: {
//     labelM: MeasuredText | undefined;
//     pctVal: number;
//   },
//   itemPosition: RectCoordsDims,
//   baseH: number
// ): RectCoordsDims {
//   return new RectCoordsDims([
//     itemPosition.x(),
//     itemPosition.bottomY() - itemHeight.pctVal * baseH,
//     itemPosition.w(),
//     itemHeight.pctVal * baseH,
//   ]);
// }
function getItemPositions(colsNonZero, baseH, itemHeights, alignments, s, x, y, colGap) {
    const itemPositions = new Map();
    // Figure out item positions
    let currentX = x;
    colsNonZero.forEach((col) => {
        let currentY = y;
        col.items.forEach((item) => {
            const itemHeight = itemHeights.get(item.id);
            assertNotUndefined(itemHeight);
            currentY += itemHeight.labelAndGapHeight;
            const itemW = item.widthOverride ?? s.sankey.itemWidth;
            const rcp = new RectCoordsDims([
                Math.floor(currentX + (s.sankey.itemWidth - itemW) / 2),
                Math.floor(currentY),
                Math.floor(itemW),
                Math.floor(itemHeight.pctVal * baseH),
            ]);
            itemPositions.set(item.id, rcp);
            const gapBelow = item.gapBelowOverride ?? s.sankey.itemGap;
            currentY = rcp.bottomY() + gapBelow;
        });
        currentX += s.sankey.itemWidth + colGap;
    });
    // Budge to alignTo
    alignments.forEach((a) => {
        let alignBottomY = 0;
        let nWithAlignId = 0;
        colsNonZero.forEach((col) => {
            col.items.forEach((item) => {
                if (item.alignment === a.id) {
                    ++nWithAlignId;
                    const itemPosition = itemPositions.get(item.id);
                    assertNotUndefined(itemPosition);
                    alignBottomY = Math.max(alignBottomY, itemPosition.bottomY());
                }
            });
        });
        if (nWithAlignId < 2) {
            return;
        }
        let currentX = x;
        colsNonZero.forEach((col) => {
            let currentY = y;
            col.items.forEach((item, i_item, arr) => {
                const itemHeight = itemHeights.get(item.id);
                assertNotUndefined(itemHeight);
                const itemPosition = itemPositions.get(item.id);
                assertNotUndefined(itemPosition);
                const gapBelow = item.gapBelowOverride ?? s.sankey.itemGap;
                if (item.alignment === a.id) {
                    const newRcp = itemPosition.getAdjusted({
                        y: alignBottomY - itemPosition.h(),
                    });
                    itemPositions.set(item.id, newRcp);
                    let prevIndex = i_item - 1;
                    let prevItem = arr[prevIndex];
                    let lastY = newRcp.y();
                    while (prevItem && prevItem.gapBelowOverride === 0) {
                        const prevItemPosition = itemPositions.get(prevItem.id);
                        assertNotUndefined(prevItemPosition);
                        const newPrevRcp = prevItemPosition.getAdjusted({
                            y: lastY - prevItemPosition.h(),
                        });
                        itemPositions.set(prevItem.id, newPrevRcp);
                        --prevIndex;
                        prevItem = arr[prevIndex];
                        lastY = newPrevRcp.y();
                    }
                    currentY = newRcp.bottomY() + gapBelow;
                    return;
                }
                currentY += itemHeight.labelAndGapHeight;
                if (itemPosition.y() < currentY) {
                    const newRcp = itemPosition.getAdjusted({ y: currentY });
                    itemPositions.set(item.id, newRcp);
                    currentY = newRcp.bottomY() + gapBelow;
                    return;
                }
                currentY = itemPosition.bottomY() + gapBelow;
            });
            currentX += s.sankey.itemWidth + colGap;
        });
    });
    return itemPositions;
}
