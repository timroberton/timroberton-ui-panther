export function getMapDataFromFiles(mapFiles, valueFileOverrides) {
    const mapData = {
        pixW: mapFiles.dataPackage.popRasterDimensions.pixelW,
        pixH: mapFiles.dataPackage.popRasterDimensions.pixelH,
        pixPopUint8: mapFiles.pop_uint8,
        pixPopFloat32: mapFiles.pop_float32,
        // Facs
        facs: mapFiles.facs
            ? {
                facLocations: mapFiles.facs.facilities_int32,
                facValues: valueFileOverrides.facValuesOverride ?? mapFiles.facs.facilityInfo,
                // Linked
                facLinks: mapFiles.facs.facLinks
                    ? {
                        pixNearestFacNumber: mapFiles.facs.facLinks.nearest_int16,
                        pixNearestFacDistance: mapFiles.facs.facLinks.distance_float32,
                        strideNearestFacs: mapFiles.dataPackage.facilitiesInfo.strideNearestFacs,
                    }
                    : undefined,
            }
            : undefined,
        // Adm1
        adm1: mapFiles.adm1_uint8
            ? {
                pixAdm1Number: mapFiles.adm1_uint8,
                adm1Values: valueFileOverrides.adm1ValuesOverride,
            }
            : undefined,
        // Adm2
        adm2: mapFiles.adm2_uint8
            ? {
                pixAdm2Number: mapFiles.adm2_uint8,
                adm2Values: valueFileOverrides.adm2ValuesOverride,
            }
            : undefined,
    };
    return mapData;
}
