export type PaddingOptions = {
    x?: number;
    y?: number;
    px?: number;
    py?: number;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
} | number | number[] | Padding | undefined;
export declare class Padding {
    private _pt;
    private _pr;
    private _pb;
    private _pl;
    constructor(pad: PaddingOptions);
    copy(): Padding;
    pt(): number;
    pr(): number;
    pb(): number;
    pl(): number;
    totalPx(): number;
    totalPy(): number;
    MUTATE_scale(scaleFactor: number): void;
    toScaled(scaleFactor: number): Padding;
}
