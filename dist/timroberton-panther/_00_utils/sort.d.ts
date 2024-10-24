export declare function getSortedAlphabetical(arr: string[]): string[];
export declare function sortAlphabetical(arr: string[]): void;
export declare function sortFuncAlphabetical(a: string, b: string): number;
export declare function sortFuncAlphabeticalReverse(b: string, a: string): number;
export declare function getSortedAlphabeticalByFunc<T>(arr: T[], byFunc: (v: T) => string): T[];
export declare function sortAlphabeticalByFunc<T>(arr: T[], byFunc: (v: T) => string): void;
