import { getColor } from "./deps";
import { getFont } from "./key_fonts";
export function getAdjustedText(cText, s) {
    return {
        font: getFont(s?.font ?? cText.font),
        fontSize: cText.fontSize * (s?.fontSizeMultiplier ?? 1),
        color: getColor(s?.color ?? cText.color),
        lineHeight: s?.lineHeight ?? cText.lineHeight,
    };
}
export function getFontInfoId(font) {
    return `${font.fontFamily.replaceAll(" ", "").replaceAll("'", "")}-${font.weight}-${font.italic ? "italic" : "normal"}`;
}
export function isFontKeyAsKey(fk) {
    return fk.key !== undefined;
}
