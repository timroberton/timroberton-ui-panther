import { type ColorKeyOrString, type LayoutStyleOptions, type TextAdjustmentOptions, type TimFigureInputs } from "./deps.ts";
export type ADTItem = ADTParagraph | ADTHeading | ADTBullets | ADTQuote | ADTRawImage | ADTFigure;
export type ADTItemType = "paragraph" | "heading" | "bullets" | "quote" | "rawImage" | "figure" | "table";
export type ADTParagraph = ADTParagraphObjectPAsString | ADTParagraphObjectPAsArray | string | string[];
type ADTParagraphObjectPAsString = {
    p: string;
    s?: ADTParagraphStyleOptions;
};
export type ADTParagraphObjectPAsArray = {
    p: string[];
    s?: ADTParagraphStyleOptions;
};
export type ADTParagraphStyleOptions = LayoutStyleOptions & TextAdjustmentOptions & {
    align?: "left" | "right" | "center";
    vAlign?: "top" | "middle" | "bottom";
    paragraphGap?: number;
};
export declare function isADTParagraph(item: ADTItem): item is ADTParagraph;
export declare function getADTParagraphAsObjectWithPStringArray(item: ADTParagraph): ADTParagraphObjectPAsArray;
export type ADTHeading = ADTHeadingGeneric | ADTHeadingH2 | ADTHeadingH3 | ADTHeadingH4;
type ADTHeadingGeneric = {
    h: string;
    level: 2 | 3 | 4;
    s?: ADTHeadingStyleOptions;
};
type ADTHeadingH2 = {
    h2: string;
    s?: ADTHeadingStyleOptions;
};
type ADTHeadingH3 = {
    h3: string;
    s?: ADTHeadingStyleOptions;
};
type ADTHeadingH4 = {
    h4: string;
    s?: ADTHeadingStyleOptions;
};
type ADTHeadingStyleOptions = LayoutStyleOptions & TextAdjustmentOptions & {
    align?: "left" | "right" | "center";
};
export declare function isADTHeading(item: ADTItem): item is ADTHeading;
export declare function getADTHeadingAsGeneric(item: ADTHeading): ADTHeadingGeneric;
export type ADTBullets = {
    bullets: ADTBullet[];
    s?: ADTBulletsStyleOptions;
};
export type ADTBullet = ADTBulletObject | string;
type ADTBulletObject = {
    bullet: string;
    level: 1 | 2 | 3 | 4;
};
export type ADTBulletsStyleOptions = LayoutStyleOptions & {
    numbered?: boolean;
    lettered?: boolean;
    startNumberingAt?: number;
    bullet1?: TextAdjustmentOptions & {
        marker?: string;
        markerIndent?: number;
        textIndent?: number;
        topGapToPreviousBullet?: number;
    };
    bullet2?: TextAdjustmentOptions & {
        marker?: string;
        markerIndent?: number;
        textIndent?: number;
        topGapToPreviousBullet?: number;
    };
    bullet3?: TextAdjustmentOptions & {
        marker?: string;
        markerIndent?: number;
        textIndent?: number;
        topGapToPreviousBullet?: number;
    };
};
export declare function isADTBullets(item: ADTItem): item is ADTBullets;
export declare function getADTBulletAsObject(item: ADTBullet): ADTBulletObject;
export type ADTQuote = ADTQuoteAsString | ADTQuoteAsArray;
type ADTQuoteAsString = {
    quote: string | string[];
    attribution?: string;
    s?: ADTQuoteStyleOptions;
};
type ADTQuoteAsArray = {
    quote: string[];
    attribution?: string;
    s?: ADTQuoteStyleOptions;
};
type ADTQuoteStyleOptions = LayoutStyleOptions & TextAdjustmentOptions & {};
export declare function isADTQuote(item: ADTItem): item is ADTQuote;
export declare function getADTQuoteAsArray(item: ADTQuote): ADTQuoteAsArray;
export type ADTRawImage = {
    imgAbsoluteFilePath: string;
    s?: ADTRawImageStyleOptions;
};
type ADTRawImageStyleOptions = LayoutStyleOptions & {
    fit?: "inside" | "cover";
    position?: "center" | "top" | "bottom" | "left" | "right";
    noTrim?: boolean;
    tint?: ColorKeyOrString;
    greyscale?: boolean;
};
export declare function isADTRawImage(item: ADTItem): item is ADTRawImage;
export type ADTFigure = TimFigureInputs & {
    s?: LayoutStyleOptions;
};
export declare function isADTFigure(item: ADTItem): item is ADTFigure;
export {};
