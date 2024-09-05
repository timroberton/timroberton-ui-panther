import { TIM_FONT_SETS } from "./tim_fonts";
import { isFontKeyAsKey, } from "./types";
const _KEY_FONTS = new Map([
    ["main400", TIM_FONT_SETS.RobotoCondensed.main400],
    ["main700", TIM_FONT_SETS.RobotoCondensed.main700],
]);
export function setKeyFonts(kf) {
    _KEY_FONTS.clear();
    _KEY_FONTS.set("main400", kf.main400);
    _KEY_FONTS.set("main700", kf.main700);
}
export function getFont(fk, overrides) {
    if (isFontKeyAsKey(fk)) {
        const finalFont = _KEY_FONTS.get(fk.key);
        if (!finalFont) {
            throw new Error("No font for this font key");
        }
        if (overrides) {
            return { ...finalFont, ...overrides };
        }
        return finalFont;
    }
    if (overrides) {
        return { ...fk, ...overrides };
    }
    return fk;
}
