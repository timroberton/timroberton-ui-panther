export declare function assert(test: boolean, msg?: string): void;
export declare function assertArray<T>(a: unknown, msg?: string): asserts a is T[];
export declare function assertNumberBetween0And1(a: unknown, msg?: string): asserts a is number;
export declare function assertNotUndefined<T>(a: T | undefined | null, msg?: string): asserts a is T;
export declare function assertTwoArraysAreSameAndInSameOrder<T>(a: T[], b: T[], msg?: string): void;
export declare function assertUnique(arr: number[] | string[], msg?: string): void;
