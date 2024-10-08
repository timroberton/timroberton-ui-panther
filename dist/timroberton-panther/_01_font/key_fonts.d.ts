import { type FontInfo, type FontKeyOrFontInfo, type KeyFonts } from "./types";
export declare function setKeyFonts(kf: KeyFonts): void;
export declare function getFont(fk: FontKeyOrFontInfo, overrides?: Partial<FontInfo>): FontInfo;
