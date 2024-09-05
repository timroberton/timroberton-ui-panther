import { Coordinates } from "./coordinates";
export class RectCoordsDims {
    _x;
    _y;
    _w;
    _h;
    constructor(rcd) {
        if (rcd instanceof RectCoordsDims) {
            this._x = rcd._x;
            this._y = rcd._y;
            this._w = rcd._w;
            this._h = rcd._h;
            return;
        }
        if (rcd instanceof Array) {
            if (rcd.length === 4) {
                this._x = rcd[0];
                this._y = rcd[1];
                this._w = rcd[2];
                this._h = rcd[3];
                return;
            }
            throw new Error("Bad inputs for RectCoordsDims constructor");
        }
        if (typeof rcd === "object") {
            this._x = rcd.x;
            this._y = rcd.y;
            this._w = rcd.w;
            this._h = rcd.h;
            return;
        }
        throw new Error("Bad inputs for RectCoordsDims constructor");
    }
    x() {
        return this._x;
    }
    y() {
        return this._y;
    }
    w() {
        return this._w;
    }
    h() {
        return this._h;
    }
    centerX() {
        return this._x + this._w / 2;
    }
    rightX() {
        return this._x + this._w;
    }
    centerY() {
        return this._y + this._h / 2;
    }
    bottomY() {
        return this._y + this._h;
    }
    topLeftCoords() {
        return new Coordinates([this.x(), this.y()]);
    }
    leftCenterCoords() {
        return new Coordinates([this.x(), this.centerY()]);
    }
    rightCenterCoords() {
        return new Coordinates([this.rightX(), this.centerY()]);
    }
    asArray() {
        return [this._x, this._y, this._w, this._h];
    }
    asObject() {
        return { x: this._x, y: this._y, w: this._w, h: this._h };
    }
    getHeightToWidthRatio() {
        return this._h / this._w;
    }
    getWidthToHeightRatio() {
        return this._w / this._h;
    }
    getCopy() {
        return new RectCoordsDims({
            x: this._x,
            y: this._y,
            w: this._w,
            h: this._h,
        });
    }
    getPadded(pad) {
        return new RectCoordsDims({
            x: this._x + pad.pl(),
            y: this._y + pad.pt(),
            w: this._w - pad.totalPx(),
            h: this._h - pad.totalPy(),
        });
    }
    getAdjusted(adjustments) {
        const goodAdjs = typeof adjustments === "function" ? adjustments(this) : adjustments;
        return new RectCoordsDims({
            x: goodAdjs.x ?? this._x,
            y: goodAdjs.y ?? this._y,
            w: goodAdjs.w ?? this._w,
            h: goodAdjs.h ?? this._h,
        });
    }
    getScaledAndCenteredInnerDimsAsRcd(dims) {
        if (dims.getHeightToWidthRatio() > this.getHeightToWidthRatio()) {
            const innerW = dims.getWidthToHeightRatio() * this._h;
            const innerX = this._x + (this._w - innerW) / 2;
            return new RectCoordsDims({
                x: innerX,
                y: this._y,
                w: innerW,
                h: this._h,
            });
        }
        const innerH = dims.getHeightToWidthRatio() * this._w;
        const innerY = this._y + (this._h - innerH) / 2;
        return new RectCoordsDims({
            x: this._x,
            y: innerY,
            w: this._w,
            h: innerH,
        });
    }
    getInnerPositionedRcd1Arg(innerDims, position) {
        switch (position) {
            case "center":
                return this.getInnerPositionedRcd2Args(innerDims, "center", "center");
            case "left":
                return this.getInnerPositionedRcd2Args(innerDims, "left", "center");
            case "right":
                return this.getInnerPositionedRcd2Args(innerDims, "right", "center");
            case "top":
                return this.getInnerPositionedRcd2Args(innerDims, "center", "top");
            case "bottom":
                return this.getInnerPositionedRcd2Args(innerDims, "center", "bottom");
            case "top-left":
                return this.getInnerPositionedRcd2Args(innerDims, "left", "top");
            case "top-center":
                return this.getInnerPositionedRcd2Args(innerDims, "center", "top");
            case "top-right":
                return this.getInnerPositionedRcd2Args(innerDims, "right", "top");
            case "bottom-left":
                return this.getInnerPositionedRcd2Args(innerDims, "left", "bottom");
            case "bottom-center":
                return this.getInnerPositionedRcd2Args(innerDims, "center", "bottom");
            case "bottom-right":
                return this.getInnerPositionedRcd2Args(innerDims, "right", "bottom");
        }
        throw new Error("Should not be possible");
    }
    getInnerPositionedRcd2Args(innerDims, horizontalPosition, verticalPosition) {
        if (this.w() < innerDims.w() || this.h() < innerDims.h()) {
            throw new Error("Outer RPD is smaller than inner RPD");
        }
        const xOffest = horizontalPosition === "center"
            ? (this.w() - innerDims.w()) / 2
            : horizontalPosition === "right"
                ? this.w() - innerDims.w()
                : 0;
        const yOffest = verticalPosition === "center"
            ? (this.h() - innerDims.h()) / 2
            : verticalPosition === "bottom"
                ? this.h() - innerDims.h()
                : 0;
        return new RectCoordsDims({
            x: this.x() + xOffest,
            y: this.y() + yOffest,
            w: innerDims.w(),
            h: innerDims.h(),
        });
    }
}
