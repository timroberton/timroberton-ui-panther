import { JSX } from "solid-js";
import { Intent } from "./types";
type OpenAlertInput = {
    title?: string;
    text: string | JSX.Element;
    intent?: Intent;
    closeButtonLabel?: string;
};
type OpenConfirmInput = {
    title?: string;
    text: string | JSX.Element;
    intent?: Intent;
    confirmButtonLabel?: string;
};
type OpenPromptInput = {
    initialInputText: string;
    title?: string;
    text?: string;
    inputLabel?: string;
    inputType?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
    intent?: Intent;
    saveButtonLabel?: string;
};
export type AlertComponentProps<TProps, TReturn> = TProps & {
    close: (p: TReturn | undefined) => void;
};
type OpenComponentInput<TProps, TReturn> = {
    elementProps: TProps;
    element: (p: AlertComponentProps<TProps, TReturn>) => JSX.Element;
};
export declare function openAlert(v: OpenAlertInput): Promise<void>;
export declare function openConfirm(v: OpenConfirmInput): Promise<boolean>;
export declare function openPrompt(v: OpenPromptInput): Promise<string | undefined>;
export declare function openComponent<TProps, TReturn>(v: OpenComponentInput<TProps, TReturn>): Promise<TReturn | undefined>;
export default function AlertProvider(): JSX.Element;
export {};
