export declare function createArray(n: number): number[];
export declare function createArray<T extends number | string | object>(n: number, valOrValFunc: T | ((i: number) => T)): T[];
