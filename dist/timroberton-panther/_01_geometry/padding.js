export class Padding {
    _pt;
    _pr;
    _pb;
    _pl;
    constructor(pad) {
        if (pad === undefined) {
            this._pt = 0;
            this._pr = 0;
            this._pb = 0;
            this._pl = 0;
            return;
        }
        if (pad instanceof Padding) {
            this._pt = pad._pt;
            this._pr = pad._pr;
            this._pb = pad._pb;
            this._pl = pad._pl;
            return;
        }
        if (typeof pad === "number") {
            this._pt = pad;
            this._pr = pad;
            this._pb = pad;
            this._pl = pad;
            return;
        }
        if (pad instanceof Array) {
            if (pad.length === 1) {
                this._pt = pad[0];
                this._pr = pad[0];
                this._pb = pad[0];
                this._pl = pad[0];
                return;
            }
            if (pad.length === 2) {
                this._pt = pad[0];
                this._pr = pad[1];
                this._pb = pad[0];
                this._pl = pad[1];
                return;
            }
            if (pad.length === 4) {
                this._pt = pad[0];
                this._pr = pad[1];
                this._pb = pad[2];
                this._pl = pad[3];
                return;
            }
            throw new Error("Bad inputs for Padding constructor");
        }
        if (typeof pad === "object") {
            this._pt = pad.top ?? pad.py ?? pad.y ?? 0;
            this._pr = pad.right ?? pad.px ?? pad.x ?? 0;
            this._pb = pad.bottom ?? pad.py ?? pad.y ?? 0;
            this._pl = pad.left ?? pad.px ?? pad.x ?? 0;
            return;
        }
        throw new Error("Bad inputs for Padding constructor");
    }
    copy() {
        return new Padding(this);
    }
    pt() {
        return this._pt;
    }
    pr() {
        return this._pr;
    }
    pb() {
        return this._pb;
    }
    pl() {
        return this._pl;
    }
    totalPx() {
        return this._pl + this._pr;
    }
    totalPy() {
        return this._pt + this._pb;
    }
    MUTATE_scale(scaleFactor) {
        this._pt = this._pt * scaleFactor;
        this._pr = this._pr * scaleFactor;
        this._pb = this._pb * scaleFactor;
        this._pl = this._pl * scaleFactor;
    }
    toScaled(scaleFactor) {
        const n = this.copy();
        n.MUTATE_scale(scaleFactor);
        return n;
    }
}
