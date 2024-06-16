import { ButtonRootProps } from "@kobalte/core/button";
import { JSX } from "solid-js";
import { Intent } from "./types";
type Props = {
    children: JSX.Element;
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
    type?: ButtonRootProps["type"];
    form?: string;
    disabled?: ButtonRootProps["disabled"];
    autofocus?: boolean;
    intent?: Intent;
};
export declare function Button(p: Props): JSX.Element;
export {};
