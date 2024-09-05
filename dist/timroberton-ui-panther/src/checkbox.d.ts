import { SelectOption } from "./select";
type CheckboxProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
};
export declare function Checkbox(p: CheckboxProps): import("solid-js").JSX.Element;
type RadioGroupProps<T extends string> = {
    value: T | undefined;
    options: SelectOption<T>[];
    onChange: (v: string) => void;
    label?: string;
};
export declare function RadioGroup<T extends string>(p: RadioGroupProps<T>): import("solid-js").JSX.Element;
export {};
