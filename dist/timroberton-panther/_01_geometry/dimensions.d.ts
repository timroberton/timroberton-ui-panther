import type { Coordinates } from "./coordinates.ts";
import type { Padding } from "./padding.ts";
import { RectCoordsDims } from "./rect_coords_dims.ts";
export type DimensionsOptions = {
    w: number;
    h: number;
} | {
    width: number;
    height: number;
} | number[];
export declare class Dimensions {
    private _w;
    private _h;
    constructor(dims: Dimensions | DimensionsOptions);
    w(): number;
    h(): number;
    asArray(): [number, number];
    asObject(): {
        w: number;
        h: number;
    };
    asRectCoordsDims(coords: Coordinates): RectCoordsDims;
    getTransposed(transpose?: boolean): Dimensions;
    getPadded(pad: Padding): Dimensions;
    getHeightToWidthRatio(): number;
    getWidthToHeightRatio(): number;
}
