export type ColorRgb = {
    r: number;
    g: number;
    b: number;
};
export type ColorRgba = {
    r: number;
    g: number;
    b: number;
    a: number;
};
export type ColorHsl = {
    h: number;
    s: number;
    l: number;
};
export type ColorXyz = {
    x: number;
    y: number;
    z: number;
};
export type ColorLab = {
    l: number;
    a: number;
    b: number;
};
export type ColorLch = {
    l: number;
    c: number;
    h: number;
};
export type ColorOptions = ColorRgb | ColorRgba | ColorHsl | ColorLch | Color | string | number[];
export declare class Color {
    private _r;
    private _g;
    private _b;
    private _a;
    constructor(opts: ColorOptions);
    copy(): Color;
    rgb(): ColorRgb;
    hsl(): ColorHsl;
    lch(): ColorLch;
    css(): string;
    MUTATE_setRgb(rgb: ColorRgb): void;
    MUTATE_opacity(opacity: number): void;
    opacity(opacity: number): Color;
    MUTATE_lighten(amount0To1: number): void;
    lighten(amount0To1: number): Color;
    MUTATE_darken(amount0To1: number): void;
    darken(amount0To1: number): Color;
    MUTATE_rotateHue(rot360: number): void;
    rotateHue(rot360: number): Color;
    MUTATE_matchHue(colorOpts: ColorOptions): void;
    matchHue(colorOpts: ColorOptions): Color;
    MUTATE_rotateHueHsl(rot360: number): void;
    rotateHueHsl(rot360: number): Color;
    MUTATE_matchHueHsl(colorOpts: ColorOptions): void;
    matchHueHsl(colorOpts: ColorOptions): Color;
    isWhite(): boolean;
    isBlack(): boolean;
    validate(): void;
    static scale(a: ColorOptions, b: ColorOptions, n: number): string[];
    static scaleFunc(a: ColorOptions, b: ColorOptions): (pct: number) => string;
    static qualScale(a: ColorOptions, n: number, rot360?: number): string[];
    static qualScaleHsl(a: ColorOptions, n: number, rot360?: number): string[];
    static strToRgba(str: string): ColorRgba;
    static rgbToHsl(rgb: ColorRgb): ColorHsl;
    static hslToRgb(hsl: ColorHsl): ColorRgb;
    static hue2rgb(p: number, q: number, t: number): number;
    static rgbToXyz(rgb: ColorRgb): ColorXyz;
    static xyzToLab(xyz: ColorXyz): ColorLab;
    static labToLch(lab: ColorLab): ColorLch;
    static lchToLab(lch: ColorLch): ColorLab;
    static labToXyz(lab: ColorLab): ColorXyz;
    static xyzToRgb(xyz: ColorXyz): ColorRgb;
    static rgbToLch(rgb: ColorRgb): ColorLch;
    static lchToRgb(lch: ColorLch): ColorRgb;
    static isRgb(c: ColorOptions): c is ColorRgb | ColorRgba;
    static isHsl(c: ColorOptions): c is ColorHsl;
    static isLch(c: ColorOptions): c is ColorLch;
}
