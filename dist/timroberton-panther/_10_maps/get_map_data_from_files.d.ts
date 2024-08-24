import type { MapFiles, TimMapData } from "./_types/mod.ts";
export declare function getMapDataFromFiles<FacValue, Adm1Value, Adm2Value>(mapFiles: MapFiles, valueFileOverrides: {
    facValuesOverride?: FacValue[];
    adm1ValuesOverride?: Adm1Value[];
    adm2ValuesOverride?: Adm2Value[];
}): TimMapData<FacValue, Adm1Value, Adm2Value>;
