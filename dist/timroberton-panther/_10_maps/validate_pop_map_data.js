export function validatePopMapData(d) {
    const nFacilities = (d.facs?.facLocations.length ?? 0) / 2;
    const nPixels = d.pixW * d.pixH;
    if (d.pixPopUint8.length < nPixels) {
        throw new Error("pixPopUint8 is not large enough to cover area");
    }
    if (d.pixPopFloat32 && d.pixPopFloat32.length !== d.pixPopUint8.length) {
        throw new Error("pixPopFloat32 not same length as pixPopUint8");
    }
    if (d.facs) {
        if (d.facs.facValues && d.facs.facValues.length !== nFacilities) {
            throw new Error("facLocations not twice the length of facValues");
        }
        if (d.facs.facLinks) {
            if (d.facs.facLinks.pixNearestFacNumber.length !==
                d.pixPopUint8.length * d.facs.facLinks.strideNearestFacs) {
                throw new Error("pixNearestFacNumber not equal to pixPopUint8");
            }
            if (d.facs.facLinks.pixNearestFacDistance.length !==
                d.pixPopUint8.length * d.facs.facLinks.strideNearestFacs) {
                throw new Error("pixNearestFacDistance not equal to pixPopUint8");
            }
            let minFacNumber = nFacilities + 1;
            let maxFacNumber = -1;
            let atLeastOneNearestFacility = false;
            d.facs.facLinks.pixNearestFacNumber.forEach((v) => {
                if (v === -9999) {
                    return;
                }
                minFacNumber = Math.min(v, minFacNumber);
                maxFacNumber = Math.max(v, maxFacNumber);
                atLeastOneNearestFacility = true;
            });
            if (atLeastOneNearestFacility) {
                if (minFacNumber < 1 || minFacNumber > nFacilities) {
                    throw new Error(`Bad nearest fac number - min is ${minFacNumber} but there are ${nFacilities} facilities`);
                }
                if (maxFacNumber < 1 || maxFacNumber > nFacilities) {
                    throw new Error(`Bad nearest fac number - max is ${maxFacNumber} but there are ${nFacilities} facilities`);
                }
            }
        }
    }
    if (d.adm1 && d.adm1.adm1Values) {
        const nAdm1s = d.adm1.adm1Values.length;
        let minAdm1Number = nAdm1s + 1;
        let maxAdm1Number = -1;
        d.adm1.pixAdm1Number.forEach((v) => {
            if (v === 0) {
                return;
            }
            minAdm1Number = Math.min(v, minAdm1Number);
            maxAdm1Number = Math.max(v, maxAdm1Number);
        });
        if (minAdm1Number < 1 || minAdm1Number > nAdm1s) {
            throw new Error(`Bad adm1 number - min is ${minAdm1Number} but there are ${nAdm1s} adm1s`);
        }
        if (maxAdm1Number < 1 || maxAdm1Number > nAdm1s) {
            throw new Error(`Bad adm1 number - max is ${maxAdm1Number} but there are ${nAdm1s} adm1s`);
        }
    }
}
