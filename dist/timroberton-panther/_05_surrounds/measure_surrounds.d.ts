import { type CustomFigureStyle, type LegendItem, type MeasuredLegend, type MeasuredText, type MergedSurroundsStyle, type RectCoordsDims } from "./deps";
export type MeasuredSurrounds = {
    caption?: {
        rcd: RectCoordsDims;
        mCaption: MeasuredText;
    };
    content: {
        rcd: RectCoordsDims;
    };
    legend?: {
        rcd: RectCoordsDims;
        mLegend: MeasuredLegend;
    };
    s: MergedSurroundsStyle;
};
export declare function measureSurrounds(ctx: CanvasRenderingContext2D, rcd: RectCoordsDims, cs: CustomFigureStyle, caption: string | undefined, legendItems: LegendItem[] | undefined): MeasuredSurrounds;
