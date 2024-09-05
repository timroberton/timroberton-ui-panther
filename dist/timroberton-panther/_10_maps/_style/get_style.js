import { _DEFAULT_STYLES } from "./default_style";
export function getMapStyle(cs) {
    return {
        padding: cs?.padding ?? _DEFAULT_STYLES.padding,
        backgroundColor: cs?.backgroundColor ?? _DEFAULT_STYLES.backgroundColor,
        //
        filterPixels: cs?.filterPixels ?? _DEFAULT_STYLES.filterPixels,
        filterFacs: cs?.filterFacs ?? _DEFAULT_STYLES.filterFacs,
        //
        pixelColor: cs?.pixelColor ?? _DEFAULT_STYLES.pixelColor,
        pixelTransparency255: cs?.pixelTransparency255 ?? _DEFAULT_STYLES.pixelTransparency255,
        pointColor: cs?.pointColor ?? _DEFAULT_STYLES.pointColor,
        pointStyle: cs?.pointStyle ?? _DEFAULT_STYLES.pointStyle,
        pointRadius: cs?.pointRadius ?? _DEFAULT_STYLES.pointRadius,
        pointStrokeWidth: cs?.pointStrokeWidth ?? _DEFAULT_STYLES.pointStrokeWidth,
    };
}
