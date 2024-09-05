import { JSX } from "solid-js";
import { Intent } from "./types";
type ButtonProps = {
    children: JSX.Element;
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    type?: HTMLButtonElement["type"];
    form?: string;
    disabled?: HTMLButtonElement["disabled"];
    autofocus?: boolean;
    intent?: Intent;
    fullWidth?: boolean;
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
