import type { TimMapStyleOptions } from "../_style/mod";
export type TimMapInputs<FacValue, Adm1Value, Adm2Value> = {
    mapType: "map";
    mapData: TimMapData<FacValue, Adm1Value, Adm2Value>;
    mapStyle?: TimMapStyleOptions<FacValue, Adm1Value, Adm2Value>;
};
export type TimMapData<FacValue, Adm1Value, Adm2Value> = {
    pixPopUint8: Uint8Array;
    pixPopFloat32?: Float32Array;
    pixW: number;
    pixH: number;
    facs?: {
        facLocations: Int32Array;
        facValues?: FacValue[];
        facLinks?: {
            pixNearestFacNumber: Int16Array;
            pixNearestFacDistance: Float32Array;
            strideNearestFacs: number;
        };
    };
    adm1?: {
        pixAdm1Number: Uint8Array;
        adm1Values?: Adm1Value[];
    };
    adm2?: {
        pixAdm2Number: Uint8Array;
        adm2Values?: Adm2Value[];
    };
};
