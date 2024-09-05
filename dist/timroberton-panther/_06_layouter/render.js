import { asyncForEach } from "./deps";
import { measureLayout } from "./layouter";
import { isColContainerWithLayout, isRowContainerWithLayout, } from "./types";
export async function measureAndRenderLayout(renderingContext, root, rpd, gapX, gapY, itemMeasurer, itemRenderer) {
    const rootWithLayout = await measureLayout(renderingContext, root, rpd, gapX, gapY, itemMeasurer);
    await renderLayout(renderingContext, rootWithLayout, itemRenderer);
}
export async function renderLayout(renderingContext, root, itemRenderer) {
    if (isRowContainerWithLayout(root)) {
        await itemRenderer(renderingContext, root, root.rpd);
        await asyncForEach(root.rows, async (row) => {
            await renderLayout(renderingContext, row, itemRenderer);
        });
        return;
    }
    if (isColContainerWithLayout(root)) {
        await itemRenderer(renderingContext, root, root.rpd);
        await asyncForEach(root.cols, async (col) => {
            await renderLayout(renderingContext, col, itemRenderer);
        });
        return;
    }
    await itemRenderer(renderingContext, root.item, root.rpd);
}
