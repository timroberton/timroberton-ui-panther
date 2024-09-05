import { type RectCoordsDims } from "./deps";
import { type ItemHeightMeasurer, type ItemOrContainerForLayout, type ItemOrContainerWithLayout, type ItemRenderer } from "./types";
export declare function measureAndRenderLayout<T, U>(renderingContext: T, root: ItemOrContainerForLayout<U>, rpd: RectCoordsDims, gapX: number, gapY: number, itemMeasurer: ItemHeightMeasurer<T, U>, itemRenderer: ItemRenderer<T, U>): Promise<void>;
export declare function renderLayout<T, U>(renderingContext: T, root: ItemOrContainerWithLayout<U>, itemRenderer: ItemRenderer<T, U>): Promise<void>;
