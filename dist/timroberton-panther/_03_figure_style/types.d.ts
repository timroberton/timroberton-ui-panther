import type { ColorKeyOrString, CoordsOffset, PaddingOptions } from "./deps";
export type PaletteLogic = "single" | "auto-by-row" | "auto-by-col" | "specific-by-row" | "specific-by-col" | "func";
export type LegendItemsSource = "default" | "only-legend-items" | "only-data" | "both-legend-items-first" | "both-data-first";
export type LegendPosition = "bottom-left" | "bottom-center" | "bottom-right" | "right-top" | "right-center" | "right-bottom" | "none";
export type UpperLabel = {
    label: string | undefined;
    labelColor?: ColorKeyOrString;
    borderStrokeWidth?: number;
    borderColor?: ColorKeyOrString;
    verticalLineStrokeWidth?: number;
    verticalLineColor?: ColorKeyOrString;
    verticalLineDash?: number[];
    verticalLineArrowHeadLength?: number;
    padding?: PaddingOptions;
    backgroundColor?: ColorKeyOrString;
};
export type DataLabelPositionOffset = {
    position: "top" | "bottom" | "left" | "right";
} & CoordsOffset;
