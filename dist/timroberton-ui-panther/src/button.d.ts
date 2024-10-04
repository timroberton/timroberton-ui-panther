import { JSX } from "solid-js";
import { Intent } from "./types";
import { StateHolderNoData } from "./state_holder_wrapper";
type ButtonProps = {
    children: JSX.Element;
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    type?: HTMLButtonElement["type"];
    form?: string;
    disabled?: HTMLButtonElement["disabled"];
    autofocus?: boolean;
    intent?: Intent;
    fullWidth?: boolean;
    loading?: boolean;
    state?: StateHolderNoData;
};
export declare function Button(p: ButtonProps): JSX.Element;
type LinkProps = {
    children: JSX.Element;
    href: string;
    intent?: Intent;
    fullWidth?: boolean;
};
export declare function Link(p: LinkProps): JSX.Element;
export {};
