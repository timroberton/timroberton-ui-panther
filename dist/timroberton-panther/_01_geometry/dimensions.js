import { RectCoordsDims } from "./rect_coords_dims";
export class Dimensions {
    _w;
    _h;
    constructor(dims) {
        if (dims instanceof Dimensions) {
            this._w = dims.w();
            this._h = dims.h();
            return;
        }
        if (dims instanceof Array) {
            if (dims.length === 2) {
                this._w = dims[0];
                this._h = dims[1];
                return;
            }
            throw new Error("Bad inputs for Dimensions constructor");
        }
        if (typeof dims === "object") {
            if (dims.w !== undefined &&
                dims.h !== undefined) {
                this._w = dims.w;
                this._h = dims.h;
                return;
            }
            if (dims.width !== undefined &&
                dims.height !== undefined) {
                this._w = dims.width;
                this._h = dims.height;
                return;
            }
        }
        throw new Error("Bad inputs for Dimensions constructor");
    }
    w() {
        return this._w;
    }
    h() {
        return this._h;
    }
    asArray() {
        return [this._w, this._h];
    }
    asObject() {
        return { w: this._w, h: this._h };
    }
    asRectCoordsDims(coords) {
        return new RectCoordsDims({
            x: coords.x(),
            y: coords.y(),
            w: this._w,
            h: this._h,
        });
    }
    getTransposed(transpose) {
        if (transpose === false) {
            return new Dimensions({ w: this._w, h: this._h });
        }
        else {
            return new Dimensions({ w: this._h, h: this._w });
        }
    }
    getPadded(pad) {
        return new Dimensions({
            w: this._w - pad.totalPx(),
            h: this._h - pad.totalPy(),
        });
    }
    getHeightToWidthRatio() {
        return this._h / this._w;
    }
    getWidthToHeightRatio() {
        return this._w / this._h;
    }
}
