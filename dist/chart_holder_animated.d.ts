import { RectCoordsDims, TimChartInputs } from "@jsr/timroberton__panther";
type Props<T extends Object> = {
    getChartInputs: (obj: T) => TimChartInputs;
    getChartRcd?: (obj: T) => RectCoordsDims;
    obj: T;
    aspectRatio?: number;
};
export declare function ChartHolderAnimated<T extends Object>(p: Props<T>): import("solid-js").JSX.Element;
export {};
