import { CheckboxRootProps } from "@kobalte/core/checkbox";
type Props = {
    checked: CheckboxRootProps["checked"];
    onChange?: CheckboxRootProps["onChange"];
    label: string;
};
export declare function Checkbox(p: Props): import("solid-js").JSX.Element;
export {};
