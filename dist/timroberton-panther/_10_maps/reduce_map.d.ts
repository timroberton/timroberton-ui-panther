import type { PixelVals, TimMapData } from "./_types/mod.ts";
export declare function reduceMap<FacValue, Adm1Value, Adm2Value, ResutsObject>(d: TimMapData<FacValue, Adm1Value, Adm2Value>, popAccumulator: (currentObj: ResutsObject, pixelVals: PixelVals<FacValue, Adm1Value, Adm2Value> | undefined) => void, initialObj: ResutsObject): ResutsObject;
