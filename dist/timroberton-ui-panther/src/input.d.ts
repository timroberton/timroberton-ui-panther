import { Intent } from "./types";
type Props = {
    value: string;
    onChange?: (v: string) => void;
    label?: string;
    intent?: Intent;
    autofocus?: boolean;
    fullWidth?: boolean;
    type?: string;
};
export declare function Input(p: Props): import("solid-js").JSX.Element;
export {};
