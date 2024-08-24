export declare function asyncForEach<T>(arr: T[], func: (t: T, i: number, arr: T[]) => Promise<void>): Promise<void>;
export declare function asyncMap<T, R>(arr: T[], func: (t: T, i: number, arr: T[]) => Promise<R>): Promise<R[]>;
