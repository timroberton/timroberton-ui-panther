import { CustomFigureStyle, LegendItem } from "./deps";
export type SurroundsHeightInfo = {
    contentW: number;
    nonContentH: number;
};
export declare function getSurroundsHeight(ctx: CanvasRenderingContext2D, width: number, cs: CustomFigureStyle, caption: string | undefined, legendItems: LegendItem[] | undefined): SurroundsHeightInfo;
