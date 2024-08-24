export type MapFiles = {
    dataPackage: DataPackage;
    pop_uint8: Uint8Array;
    pop_float32?: Float32Array;
    facs?: {
        facilities_int32: Int32Array;
        facLinks?: {
            nearest_int16: Int16Array;
            distance_float32: Float32Array;
        };
        facilityInfo?: any[];
    };
    adm1_uint8?: Uint8Array;
    adm2_uint8?: Uint8Array;
};
export type DataPackage = {
    popRasterDimensions: {
        pixelW: number;
        pixelH: number;
        nPixels: number;
        geoExtent: number[];
    };
    admInfo: AdmInfo;
    facilitiesInfo: FacilitiesInfo;
    files: string[];
};
export type PopDimensions = {
    scaledPixels: number[];
    scaledExtent: number[];
    nRows: number;
};
export type AdmInfo = {
    hasAdm1: boolean;
    minAdm1Number: number;
    maxAdm1Number: number;
    hasAdm2: boolean;
    minAdm2Number: number;
    maxAdm2Number: number;
};
export type FacilitiesInfo = {
    nFacilitiesInDataset: number;
    nFacilitiesInPopRaster: number;
    specifiedFacTypes: string[];
    strideNearestFacs: number;
    facilityInfoHasBeenIncluded: boolean;
};
