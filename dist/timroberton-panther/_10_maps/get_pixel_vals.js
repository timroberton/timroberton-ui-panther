export function getPixelVals(data, iPixInOriginal) {
    const hasAdm1Number = data.adm1 && data.adm1.pixAdm1Number[iPixInOriginal] !== 0;
    const adm1Index = hasAdm1Number
        ? data.adm1.pixAdm1Number[iPixInOriginal] - 1
        : undefined;
    const hasAdm2Number = data.adm2 && data.adm2.pixAdm2Number[iPixInOriginal] !== 0;
    const adm2Index = hasAdm2Number
        ? data.adm2.pixAdm2Number[iPixInOriginal] - 1
        : undefined;
    if (!data.facs || !data.facs.facLinks) {
        return {
            popFloat32: data.pixPopFloat32?.[iPixInOriginal],
            adm1Index,
            adm2Index,
            nearestFacs: [],
            adm1Value: adm1Index !== undefined
                ? data.adm1?.adm1Values?.[adm1Index]
                : undefined,
            adm2Value: adm2Index !== undefined
                ? data.adm2?.adm2Values?.[adm2Index]
                : undefined,
        };
    }
    const nearestFacs = [];
    for (let i_f = 0; i_f < data.facs.facLinks.strideNearestFacs; i_f++) {
        const iInNearest = iPixInOriginal * data.facs.facLinks.strideNearestFacs + i_f;
        const hasFacNumber = data.facs.facLinks.pixNearestFacNumber !== undefined &&
            data.facs.facLinks.pixNearestFacNumber[iInNearest] !== -9999;
        if (!hasFacNumber) {
            nearestFacs.push("nofac");
            continue;
        }
        const facIndex = data.facs.facLinks.pixNearestFacNumber[iInNearest] - 1;
        nearestFacs.push({
            facIndex,
            facDistance: data.facs.facLinks.pixNearestFacDistance[iInNearest],
            facValue: data.facs.facValues?.[facIndex],
        });
    }
    return {
        popFloat32: data.pixPopFloat32?.[iPixInOriginal],
        // Linked facs
        nearestFacs,
        // Adm 1
        adm1Index,
        adm1Value: adm1Index !== undefined ? data.adm1?.adm1Values?.[adm1Index] : undefined,
        // Adm 2
        adm2Index,
        adm2Value: adm2Index !== undefined ? data.adm2?.adm2Values?.[adm2Index] : undefined,
    };
}
