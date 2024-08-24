import type { PixelVals, TimMapData } from "./_types/mod.ts";
export declare function reduceFacilities<FacValue, Adm1Value, Adm2Value, ResutsObject>(d: TimMapData<FacValue, Adm1Value, Adm2Value>, facAccumulator: (currentObj: ResutsObject, facValue: FacValue | undefined, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value> | undefined) => void, initialObj: ResutsObject): ResutsObject;
