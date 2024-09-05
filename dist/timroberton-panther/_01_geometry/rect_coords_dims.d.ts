import { Coordinates } from "./coordinates";
import type { Dimensions } from "./dimensions";
import type { Padding } from "./padding";
export type RectCoordsDimsOptions = {
    x: number;
    y: number;
    w: number;
    h: number;
} | RectCoordsDims | number[];
export declare class RectCoordsDims {
    private _x;
    private _y;
    private _w;
    private _h;
    constructor(rcd: RectCoordsDimsOptions);
    x(): number;
    y(): number;
    w(): number;
    h(): number;
    centerX(): number;
    rightX(): number;
    centerY(): number;
    bottomY(): number;
    topLeftCoords(): Coordinates;
    leftCenterCoords(): Coordinates;
    rightCenterCoords(): Coordinates;
    asArray(): number[];
    asObject(): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getHeightToWidthRatio(): number;
    getWidthToHeightRatio(): number;
    getCopy(): RectCoordsDims;
    getPadded(pad: Padding): RectCoordsDims;
    getAdjusted(adjustments: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
    } | ((prev: RectCoordsDims) => {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
    })): RectCoordsDims;
    getScaledAndCenteredInnerDimsAsRcd(dims: Dimensions): RectCoordsDims;
    getInnerPositionedRcd1Arg(innerDims: Dimensions, position: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"): RectCoordsDims;
    getInnerPositionedRcd2Args(innerDims: Dimensions, horizontalPosition: "center" | "left" | "right", verticalPosition: "center" | "top" | "bottom"): RectCoordsDims;
}
