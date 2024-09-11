import { Intent } from "./types";
export type SelectOption<T extends string> = {
    value: T;
    label: string;
};
export declare function getSelectOptions(arr: string[]): SelectOption<string>[];
export declare function getSelectOptionsFromIdLabel(arr: {
    id: string;
    label: string;
}[]): SelectOption<string>[];
type Props<T extends string> = {
    value: T | undefined;
    options: SelectOption<T>[];
    onChange: (v: string) => void;
    intent?: Intent;
    label?: string;
    fullWidth?: boolean;
};
export declare function Select<T extends string>(p: Props<T>): import("solid-js").JSX.Element;
export {};
