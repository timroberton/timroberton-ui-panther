import { Intent } from "./types";
export type SelectOption<T extends string | number> = {
    value: T;
    label: string;
};
type Props<T extends string | number> = {
    value: T | undefined;
    options: SelectOption<T>[];
    onChange: (v: T) => void;
    placeholder?: string;
    intent?: Intent;
    label?: string;
    fullWidth?: boolean;
};
export declare function Select<T extends string | number>(p: Props<T>): import("solid-js").JSX.Element;
export {};
