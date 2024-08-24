import type { CoordsOffset } from "./types.ts";
export type CoordinatesOptions = {
    x: number;
    y: number;
} | number[] | Coordinates;
export declare class Coordinates {
    private _x;
    private _y;
    constructor(coords: CoordinatesOptions);
    x(): number;
    y(): number;
    asArray(): number[];
    asObject(): {
        x: number;
        y: number;
    };
    getOffsetted(offset: CoordsOffset | undefined, offsetScaleFactor?: number): Coordinates;
}
