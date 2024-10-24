export declare function getUnique<T extends number | string>(arr: T[]): T[];
export declare function getDuplicates<T extends number | string>(arr: T[]): T[];
export declare function isUnique(arr: (number | string)[]): boolean;
export declare function getUniqueByFunc<T>(arr: T[], byFunc: (v: T) => string | number): T[];
export declare function isUniqueByFunc<T>(arr: T[], byFunc: (v: T) => string | number): boolean;
