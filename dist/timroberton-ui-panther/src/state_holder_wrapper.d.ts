import { JSX } from "solid-js";
export type StateHolder<T> = {
    status: "loading";
} | {
    status: "error";
    err: string;
} | {
    status: "ready";
    data: T;
};
type Props<T> = {
    state: StateHolder<T>;
    children: (v: T) => JSX.Element;
    onErrorButton?: {
        label: string;
        onClick: () => void;
    } | {
        label: string;
        link: string;
    };
};
export declare function StateHolderWrapper<T>(p: Props<T>): JSX.Element;
export {};
