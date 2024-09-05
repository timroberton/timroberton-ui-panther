import { Color } from "./color_class";
import { getColor } from "./key_colors";
export function getAdjustedColor(color, strategy) {
    if (strategy.brighten !== undefined) {
        return new Color(getColor(color))
            .lighten(strategy.brighten)
            .css();
    }
    if (strategy.darken !== undefined) {
        return new Color(getColor(color))
            .darken(strategy.darken)
            .css();
    }
    if (strategy.opacity !== undefined) {
        return new Color(getColor(color))
            .opacity(strategy.opacity)
            .css();
    }
    return getColor(strategy);
}
