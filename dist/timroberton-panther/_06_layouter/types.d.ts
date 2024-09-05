import type { ColorKeyOrString, PaddingOptions, RectCoordsDims } from "./deps";
export type MeasurableItem<U> = U & {
    height?: number;
    stretch?: boolean;
};
export type ContainerLayoutStyleOptions = LayoutStyleOptions & {
    verticalAlignContents?: "top" | "middle" | "bottom";
};
export type ItemOrContainerForLayout<U> = MeasurableItem<U> | ColContainerForLayout<U> | RowContainerForLayout<U>;
export type ColContainerForLayout<U> = {
    cols: (ItemOrContainerForLayout<U> & {
        span?: number;
    })[];
    height?: number;
    stretch?: boolean;
    s?: ContainerLayoutStyleOptions;
};
export type RowContainerForLayout<U> = {
    rows: ItemOrContainerForLayout<U>[];
    height?: number;
    stretch?: boolean;
    s?: ContainerLayoutStyleOptions;
};
export type ItemOrContainerWithLayout<U> = {
    item: MeasurableItem<U>;
    rpd: RectCoordsDims;
} | RowContainerWithLayout<U> | ColContainerWithLayout<U>;
export type ColContainerWithLayout<U> = {
    cols: ItemOrContainerWithLayout<U>[];
    rpd: RectCoordsDims;
    s?: ContainerLayoutStyleOptions;
};
export type RowContainerWithLayout<U> = {
    rows: ItemOrContainerWithLayout<U>[];
    rpd: RectCoordsDims;
    s?: ContainerLayoutStyleOptions;
};
export declare function isColContainerForLayout<U>(item: ItemOrContainerForLayout<U>): item is ColContainerForLayout<U>;
export declare function isRowContainerForLayout<U>(item: ItemOrContainerForLayout<U>): item is RowContainerForLayout<U>;
export declare function isMeasurableItem<U>(item: ItemOrContainerForLayout<U>): item is MeasurableItem<U>;
export declare function isColContainerWithLayout<U>(item: ItemOrContainerWithLayout<U>): item is ColContainerWithLayout<U>;
export declare function isRowContainerWithLayout<U>(item: ItemOrContainerWithLayout<U>): item is RowContainerWithLayout<U>;
export declare function isContainerInMeasurerFunc<U>(item: MeasurableItem<U> | ColContainerWithLayout<U> | RowContainerWithLayout<U>): item is ColContainerWithLayout<U> | RowContainerWithLayout<U>;
export type ItemIdealHeightInfo = {
    idealH: number;
    couldStretch: boolean;
};
export type ItemHeightMeasurer<T, U> = (renderingContext: T, item: U & MeasurableItem<U>, width: number) => Promise<ItemIdealHeightInfo>;
export type ItemRenderer<T, U> = (renderingContext: T, item: (U & MeasurableItem<U>) | ColContainerWithLayout<U> | RowContainerWithLayout<U>, rpd: RectCoordsDims) => Promise<void>;
export type LayoutStyleOptions = {
    padding?: PaddingOptions;
    backgroundColor?: ColorKeyOrString;
    backgroundImg?: BackgroundImgStyleOptions;
    rectRadius?: number;
};
export type BackgroundImgStyleOptions = {
    imgAbsoluteFilePath: string;
    position?: "center" | "top" | "bottom" | "left" | "right";
    tint?: ColorKeyOrString;
    greyscale?: boolean;
};
