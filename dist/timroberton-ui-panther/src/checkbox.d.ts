import { JSX } from "solid-js";
import { SelectOption } from "./select";
type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string | JSX.Element;
};
export declare function Checkbox(p: CheckboxProps): JSX.Element;
type RadioGroupProps<T extends string> = {
    value: T | undefined;
    options: SelectOption<T>[];
    onChange: (v: string) => void;
    label?: string | JSX.Element;
    horizontal?: boolean;
};
export declare function RadioGroup<T extends string>(p: RadioGroupProps<T>): JSX.Element;
export {};
