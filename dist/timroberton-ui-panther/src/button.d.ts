import { ButtonRootProps } from "@kobalte/core/button";
import { JSX } from "solid-js";
import { Intent } from "./types";
type ButtonProps = {
    children: JSX.Element;
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    type?: ButtonRootProps["type"];
    form?: string;
    disabled?: ButtonRootProps["disabled"];
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
    disabled?: boolean;
};
export declare function Link(p: LinkProps): JSX.Element;
export {};
