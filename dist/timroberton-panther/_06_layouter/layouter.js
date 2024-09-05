import { asyncForEach } from "../mod";
import { Padding, RectCoordsDims, anyTrue, asyncMap, sum } from "./deps";
import { getColWidths } from "./get_col_widths";
import { isColContainerForLayout, isMeasurableItem, isRowContainerForLayout, } from "./types";
const _DEFAULT_N_COL_SPAN = 12;
export async function measureLayout(renderingContext, root, rpd, gapX, gapY, itemHeightMeasurer) {
    if (isRowContainerForLayout(root)) {
        const pad = new Padding(root.s?.padding ?? 0);
        const innerRpd = rpd.getPadded(pad);
        const rows = await getRowsWithLayout(renderingContext, root.rows, innerRpd, gapX, gapY, itemHeightMeasurer);
        const rowsH = root.height ??
            sum(rows.map((inf) => inf.rpd.h())) +
                (rows.length - 1) * gapY +
                pad.totalPy();
        if (rowsH > rpd.h()) {
            console.log(rowsH, "is bigger than", rpd.h());
            console.log(root);
            throw new Error("Rows too tall 100");
        }
        return {
            rows,
            rpd: root.stretch ? rpd : rpd.getAdjusted({ h: rowsH }),
            s: root.s,
        };
    }
    if (isColContainerForLayout(root)) {
        const pad = new Padding(root.s?.padding ?? 0);
        const innerRpd = rpd.getPadded(pad);
        const cols = await getColsWithLayout(renderingContext, root.cols, innerRpd, gapX, gapY, itemHeightMeasurer);
        const colsH = root.height ??
            Math.max(...cols.map((inf) => inf.rpd.h())) + pad.totalPy();
        if (colsH > rpd.h()) {
            console.log(colsH, "is bigger than", rpd.h());
            console.log(root);
            throw new Error("Cols too tall 101");
        }
        return {
            cols,
            rpd: root.stretch ? rpd : rpd.getAdjusted({ h: colsH }),
            s: root.s,
        };
    }
    if (isMeasurableItem(root)) {
        const itemInfo = await itemHeightMeasurer(renderingContext, root, rpd.w());
        const itemRpd = rpd.getAdjusted({
            h: itemInfo.couldStretch ? rpd.h() : itemInfo.idealH,
        });
        if (itemRpd.h() > rpd.h()) {
            console.log(itemRpd.h(), "is bigger than", rpd.h());
            console.log(root);
            throw new Error("Item too tall 102");
        }
        return {
            item: root,
            rpd: itemRpd,
        };
    }
    throw new Error("Should not be possible");
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
async function getRowsWithLayout(renderingContext, rows, rpd, gapX, gapY, itemHeightMeasurer) {
    const rowInfos = await getProposedHeightsOfRows(renderingContext, rows, rpd.w(), gapX, gapY, itemHeightMeasurer);
    const totalProposedRowHeights = sum(rowInfos.map((inf) => inf.idealH));
    const totalGapH = (rows.length - 1) * gapY;
    const remainingHeight = rpd.h() - (totalProposedRowHeights + totalGapH);
    if (remainingHeight < 0) {
        console.log(rows);
        console.log(totalProposedRowHeights);
        console.log(rpd.h);
        console.log(remainingHeight);
        throw new Error("Rows too tall");
    }
    const nCouldStretchRows = rowInfos.filter((inf) => inf.couldStretch).length;
    const extraHeightToAddToCouldStretchRows = remainingHeight / nCouldStretchRows;
    const rowsWithLayout = [];
    let currentY = rpd.y();
    await asyncForEach(rows, async (itemOrContainer, i_itemOrContainer) => {
        const rowInfo = rowInfos[i_itemOrContainer];
        const rowH = rowInfo.idealH +
            (rowInfo.couldStretch ? extraHeightToAddToCouldStretchRows : 0);
        if (rowH > rpd.h()) {
            console.log(rowH, "is bigger than", rpd.h());
            console.log(rows);
            throw new Error("Row too tall 20");
        }
        const rowRpd = new RectCoordsDims({
            x: rpd.x(),
            y: currentY,
            w: rpd.w(),
            h: rowH,
        });
        if (isColContainerForLayout(itemOrContainer)) {
            const pad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerRowRpd = rowRpd.getPadded(pad);
            const cols = await getColsWithLayout(renderingContext, itemOrContainer.cols, innerRowRpd, gapX, gapY, itemHeightMeasurer);
            const colsH = itemOrContainer.height ??
                Math.max(...cols.map((inf) => inf.rpd.h())) + pad.totalPy();
            if (colsH > rpd.h()) {
                console.log(colsH, "is bigger than", rpd.h());
                console.log(itemOrContainer);
                throw new Error("Cols too tall 11");
            }
            rowsWithLayout.push({
                cols,
                rpd: itemOrContainer.stretch
                    ? rowRpd
                    : rowRpd.getAdjusted({ h: colsH }),
                s: itemOrContainer.s,
            });
        }
        else if (isRowContainerForLayout(itemOrContainer)) {
            const pad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerRowRpd = rowRpd.getPadded(pad);
            const rows = await getRowsWithLayout(renderingContext, itemOrContainer.rows, innerRowRpd, gapX, gapY, itemHeightMeasurer);
            const rowsH = itemOrContainer.height ??
                sum(rows.map((inf) => inf.rpd.h())) +
                    (rows.length - 1) * gapY +
                    pad.totalPy();
            if (rowsH > rpd.h()) {
                console.log(rowsH, "is bigger than", rpd.h());
                console.log(itemOrContainer);
                throw new Error("Rows too tall 12");
            }
            rowsWithLayout.push({
                rows,
                rpd: itemOrContainer.stretch
                    ? rowRpd
                    : rowRpd.getAdjusted({ h: rowsH }),
                s: itemOrContainer.s,
            });
        }
        else {
            rowsWithLayout.push({
                item: itemOrContainer,
                rpd: rowRpd,
            });
        }
        currentY += rowH + gapY;
    });
    return rowsWithLayout;
}
async function getColsWithLayout(renderingContext, cols, rpd, gapX, gapY, itemHeightMeasurer) {
    const colsWithLayout = [];
    let currentX = rpd.x();
    const colWidths = getColWidths(cols, rpd.w(), _DEFAULT_N_COL_SPAN, gapX);
    await asyncForEach(cols, async (itemOrContainer, i_itemOrContainer) => {
        const colWidthInfo = colWidths[i_itemOrContainer];
        if (isRowContainerForLayout(itemOrContainer)) {
            const colRpd = new RectCoordsDims({
                x: currentX,
                y: rpd.y(),
                w: colWidthInfo.w,
                h: rpd.h(),
            });
            const pad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerColRpd = colRpd.getPadded(pad);
            const rows = await getRowsWithLayout(renderingContext, itemOrContainer.rows, innerColRpd, gapX, gapY, itemHeightMeasurer);
            const rowsH = itemOrContainer.height ??
                sum(rows.map((inf) => inf.rpd.h())) +
                    (rows.length - 1) * gapY +
                    pad.totalPy();
            if (rowsH > rpd.h()) {
                console.log(rowsH, "is bigger than", rpd.h());
                console.log(itemOrContainer);
                throw new Error("Rows too tall 1");
            }
            colsWithLayout.push({
                rows,
                rpd: itemOrContainer.stretch
                    ? colRpd
                    : colRpd.getAdjusted({ h: rowsH }),
                s: itemOrContainer.s,
            });
        }
        else if (isColContainerForLayout(itemOrContainer)) {
            const colRpd = new RectCoordsDims({
                x: currentX,
                y: rpd.y(),
                w: colWidthInfo.w,
                h: rpd.h(),
            });
            const pad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerColRpd = colRpd.getPadded(pad);
            const cols = await getColsWithLayout(renderingContext, itemOrContainer.cols, innerColRpd, gapX, gapY, itemHeightMeasurer);
            const colsH = itemOrContainer.height ??
                Math.max(...cols.map((inf) => inf.rpd.h())) + pad.totalPy();
            if (colsH > rpd.h()) {
                console.log(colsH, "is bigger than", rpd.h());
                console.log(itemOrContainer);
                throw new Error("Col too tall 2");
            }
            colsWithLayout.push({
                cols,
                rpd: itemOrContainer.stretch
                    ? colRpd
                    : colRpd.getAdjusted({ h: colsH }),
                s: itemOrContainer.s,
            });
        }
        else {
            const colInfo = await itemHeightMeasurer(renderingContext, itemOrContainer, colWidthInfo.w);
            const colRpd = new RectCoordsDims({
                x: currentX,
                y: rpd.y(),
                w: colWidthInfo.w,
                h: colInfo.couldStretch ? rpd.h() : colInfo.idealH,
            });
            if (colRpd.h() > rpd.h()) {
                console.log(colRpd.h(), "is bigger than", rpd.h());
                console.log(itemOrContainer);
                throw new Error("Col too tall 3");
            }
            colsWithLayout.push({
                item: itemOrContainer,
                rpd: colRpd,
            });
        }
        currentX += colWidthInfo.w + gapX;
    });
    return colsWithLayout;
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export async function getProposedHeightsOfRows(renderingContext, rows, width, gapX, gapY, itemHeightMeasurer) {
    return await asyncMap(rows, async (itemOrContainer) => {
        if (isColContainerForLayout(itemOrContainer)) {
            const containerPad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerW = width - containerPad.totalPx();
            const infos = await getProposedHeightsOfCols(renderingContext, itemOrContainer.cols, innerW, gapX, gapY, itemHeightMeasurer);
            return {
                idealH: (itemOrContainer.height ??
                    Math.max(...infos.map((inf) => inf.idealH))) +
                    containerPad.totalPy(),
                couldStretch: !!itemOrContainer.stretch ||
                    anyTrue(infos.map((inf) => !!inf.couldStretch)),
            };
        }
        else if (isRowContainerForLayout(itemOrContainer)) {
            const containerPad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerW = width - containerPad.totalPx();
            const infos = await getProposedHeightsOfRows(renderingContext, itemOrContainer.rows, innerW, gapX, gapY, itemHeightMeasurer);
            return {
                idealH: (itemOrContainer.height ??
                    sum(infos.map((inf) => inf.idealH)) + (infos.length - 1) * gapY) +
                    containerPad.totalPy(),
                couldStretch: !!itemOrContainer.stretch ||
                    anyTrue(infos.map((inf) => !!inf.couldStretch)),
            };
        }
        else {
            return await itemHeightMeasurer(renderingContext, itemOrContainer, width);
        }
    });
}
async function getProposedHeightsOfCols(renderingContext, cols, width, gapX, gapY, itemHeightMeasurer) {
    const colWidths = getColWidths(cols, width, _DEFAULT_N_COL_SPAN, gapX);
    return await asyncMap(cols, async (itemOrContainer, i_itemOrContainer) => {
        const colWidthInfo = colWidths[i_itemOrContainer];
        if (isRowContainerForLayout(itemOrContainer)) {
            const containerPad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerW = colWidthInfo.w - containerPad.totalPx();
            const infos = await getProposedHeightsOfRows(renderingContext, itemOrContainer.rows, innerW, gapX, gapY, itemHeightMeasurer);
            return {
                idealH: (itemOrContainer.height ??
                    sum(infos.map((inf) => inf.idealH)) + (infos.length - 1) * gapY) +
                    containerPad.totalPy(),
                couldStretch: !!itemOrContainer.stretch ||
                    anyTrue(infos.map((inf) => !!inf.couldStretch)),
            };
        }
        else if (isColContainerForLayout(itemOrContainer)) {
            const containerPad = new Padding(itemOrContainer.s?.padding ?? 0);
            const innerW = colWidthInfo.w - containerPad.totalPx();
            const infos = await getProposedHeightsOfCols(renderingContext, itemOrContainer.cols, innerW, gapX, gapY, itemHeightMeasurer);
            return {
                idealH: (itemOrContainer.height ??
                    Math.max(...infos.map((inf) => inf.idealH))) +
                    containerPad.totalPy(),
                couldStretch: !!itemOrContainer.stretch ||
                    anyTrue(infos.map((inf) => !!inf.couldStretch)),
            };
        }
        else {
            return await itemHeightMeasurer(renderingContext, itemOrContainer, colWidthInfo.w);
        }
    });
}
