import { TextFieldRootOptions } from "@kobalte/core/text-field";
import { Intent } from "./types";
type Props = {
    value: TextFieldRootOptions["value"];
    onChange?: TextFieldRootOptions["onChange"];
    label?: string;
    intent?: Intent;
    autofocus?: boolean;
    fullWidth?: boolean;
};
export declare function Input(p: Props): import("solid-js").JSX.Element;
export {};
