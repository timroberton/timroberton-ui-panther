import { type ColorKeyOrString } from "./deps.ts";
export type TextInfoUnkeyed = {
    font: FontInfo;
    fontSize: number;
    color: string;
    lineHeight: number;
};
export type TextInfo = {
    font: FontKeyOrFontInfo;
    fontSize: number;
    color: ColorKeyOrString;
    lineHeight: number;
};
export type TextInfoOptions = {
    font?: FontKeyOrFontInfo;
    fontSize?: number;
    color?: ColorKeyOrString;
    lineHeight?: number;
};
export type CustomStyleTextOptions = {
    font?: FontKeyOrFontInfo | "same-as-base";
    relFontSize?: number;
    color?: ColorKeyOrString | "same-as-base";
    lineHeight?: number | "same-as-base";
};
export type TextAdjustmentOptions = {
    fontSizeMultiplier?: number;
    color?: ColorKeyOrString;
    font?: FontKeyOrFontInfo;
    lineHeight?: number;
};
export declare function getAdjustedText(cText: TextInfo, s?: TextAdjustmentOptions): TextInfoUnkeyed;
export type FontInfo = {
    fontFamily: string;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    italic: boolean;
};
export declare function getFontInfoId(font: FontInfo): string;
export type KeyFonts = {
    main400: FontInfo;
    main700: FontInfo;
};
export type KeyFontsKey = keyof KeyFonts;
export type FontKeyOrFontInfo = {
    key: KeyFontsKey;
} | FontInfo;
export declare function isFontKeyAsKey(fk: FontKeyOrFontInfo): fk is {
    key: KeyFontsKey;
};
