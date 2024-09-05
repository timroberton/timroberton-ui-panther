import { assertNotUndefined } from "./deps";
import { getPixelVals } from "./get_pixel_vals";
export function reduceFacilities(d, facAccumulator, initialObj) {
    assertNotUndefined(d.facs, "Must have facility data for reduceFacilities");
    const resultsObj = structuredClone(initialObj);
    const nFacilities = d.facs.facLocations.length / 2;
    for (let iFac = 0; iFac < nFacilities; iFac++) {
        const facX = d.facs.facLocations[iFac * 2];
        const facY = d.facs.facLocations[iFac * 2 + 1];
        if (facX === -9999 && facY === -9999) {
            facAccumulator(resultsObj, undefined, undefined);
            continue;
        }
        if (facX < 0 || facX >= d.pixW || facY < 0 || facY >= d.pixH) {
            facAccumulator(resultsObj, undefined, undefined);
            continue;
        }
        const iPixInOriginal = facX + facY * d.pixW;
        const pixelVals = getPixelVals(d, iPixInOriginal);
        const facValue = d.facs.facValues?.[iFac];
        facAccumulator(resultsObj, facValue, pixelVals);
    }
    return resultsObj;
}
