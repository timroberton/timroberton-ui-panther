import { getPixelVals } from "./get_pixel_vals.ts";
export function reduceMap(d, popAccumulator, initialObj) {
    const resultsObj = structuredClone(initialObj);
    let iPix = -1;
    for (let y = 0; y < d.pixH; y++) {
        for (let x = 0; x < d.pixW; x++) {
            iPix += 1;
            if (d.pixPopUint8[iPix] === 255) {
                popAccumulator(resultsObj, undefined);
                continue;
            }
            const vals = getPixelVals(d, iPix);
            popAccumulator(resultsObj, vals);
        }
    }
    return resultsObj;
}
