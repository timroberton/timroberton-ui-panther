export type PixelVals<FacValue, Adm1Value, Adm2Value> = {
    popFloat32?: number;
    nearestFacs: ({
        facIndex: number;
        facDistance: number;
        facValue: FacValue | undefined;
    } | "nofac")[];
    adm1Index: number | undefined;
    adm1Value: Adm1Value | undefined;
    adm2Index: number | undefined;
    adm2Value: Adm2Value | undefined;
};
