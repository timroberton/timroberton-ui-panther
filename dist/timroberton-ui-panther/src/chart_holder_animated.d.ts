import { RectCoordsDims, TimFigureInputs } from "./deps";
type Props<T extends Object> = {
    getFigureInputs: (obj: T) => TimFigureInputs;
    getFigureRcd?: (obj: T) => RectCoordsDims;
    obj: T;
    aspectRatio?: number;
};
export declare function ChartHolderAnimated<T extends Object>(p: Props<T>): import("solid-js").JSX.Element;
export {};
