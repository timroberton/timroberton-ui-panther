import { getStyleValOrFuncValOneArg } from "./_style/mod";
import { getColorAsRgb } from "./deps";
import { getPixelVals } from "./get_pixel_vals";
const _COLOR_CACHE = new Map();
export function getPopMapAsImageData(d, s) {
    const imageData = new ImageData(d.pixW, d.pixH);
    let iPix = -1;
    for (let y = 0; y < d.pixH; y++) {
        for (let x = 0; x < d.pixW; x++) {
            iPix += 1;
            if (d.pixPopUint8[iPix] === 255) {
                continue;
            }
            const vals = getPixelVals(d, iPix);
            if (s.filterPixels && !s.filterPixels(vals)) {
                continue;
            }
            const colorKey = getStyleValOrFuncValOneArg(s.pixelColor, vals);
            const hash = typeof colorKey === "string" ? colorKey : colorKey.key;
            let colorAsRgb = _COLOR_CACHE.get(hash);
            if (!colorAsRgb) {
                colorAsRgb = getColorAsRgb(colorKey);
                _COLOR_CACHE.set(hash, colorAsRgb);
            }
            const iImgData = iPix * 4;
            imageData.data[iImgData + 0] = colorAsRgb.r;
            imageData.data[iImgData + 1] = colorAsRgb.g;
            imageData.data[iImgData + 2] = colorAsRgb.b;
            imageData.data[iImgData + 3] = getStyleValOrFuncValOneArg(s.pixelTransparency255 ?? d.pixPopUint8[iPix], vals);
        }
    }
    return imageData;
}
