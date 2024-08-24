import { RectCoordsDims } from "./deps.ts";
import { type ItemHeightMeasurer, type ItemIdealHeightInfo, type ItemOrContainerForLayout, type ItemOrContainerWithLayout } from "./types.ts";
export declare function measureLayout<T, U>(renderingContext: T, root: ItemOrContainerForLayout<U>, rpd: RectCoordsDims, gapX: number, gapY: number, itemHeightMeasurer: ItemHeightMeasurer<T, U>): Promise<ItemOrContainerWithLayout<U>>;
export declare function getProposedHeightsOfRows<T, U>(renderingContext: T, rows: ItemOrContainerForLayout<U>[], width: number, gapX: number, gapY: number, itemHeightMeasurer: ItemHeightMeasurer<T, U>): Promise<ItemIdealHeightInfo[]>;
