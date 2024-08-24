export class Coordinates {
    _x;
    _y;
    constructor(coords) {
        if (coords instanceof Coordinates) {
            this._x = coords._x;
            this._y = coords._y;
            return;
        }
        if (coords instanceof Array) {
            if (coords.length === 2) {
                this._x = coords[0];
                this._y = coords[1];
                return;
            }
            throw new Error("Bad inputs for Coordinates constructor");
        }
        if (typeof coords === "object") {
            this._x = coords.x;
            this._y = coords.y;
            return;
        }
        throw new Error("Bad inputs for Coordinates constructor");
    }
    x() {
        return this._x;
    }
    y() {
        return this._y;
    }
    asArray() {
        return [this._x, this._y];
    }
    asObject() {
        return { x: this._x, y: this._y };
    }
    getOffsetted(offset, offsetScaleFactor) {
        if (!offset) {
            return new Coordinates(this);
        }
        const sf = offsetScaleFactor ?? 1;
        if (offset.left) {
            if (offset.top) {
                return new Coordinates({
                    x: this.x() - offset.left * sf,
                    y: this.y() - offset.top * sf,
                });
            }
            if (offset.bottom) {
                return new Coordinates({
                    x: this.x() - offset.left * sf,
                    y: this.y() + offset.bottom * sf,
                });
            }
            return new Coordinates({
                x: this.x() - offset.left * sf,
                y: this.y(),
            });
        }
        if (offset.right) {
            if (offset.top) {
                return new Coordinates({
                    x: this.x() + offset.right * sf,
                    y: this.y() - offset.top * sf,
                });
            }
            if (offset.bottom) {
                return new Coordinates({
                    x: this.x() + offset.right * sf,
                    y: this.y() + offset.bottom * sf,
                });
            }
            return new Coordinates({
                x: this.x() + offset.right * sf,
                y: this.y(),
            });
        }
        if (offset.top) {
            return new Coordinates({
                x: this.x(),
                y: this.y() - offset.top * sf,
            });
        }
        if (offset.bottom) {
            return new Coordinates({
                x: this.x(),
                y: this.y() + offset.bottom * sf,
            });
        }
        return new Coordinates(this);
    }
}
