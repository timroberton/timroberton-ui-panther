import { JSX } from "solid-js";
export type StateHolderNoData = {
    status: "loading";
    msg?: string;
} | {
    status: "error";
    err: string;
} | {
    status: "ready";
};
type StateHolderErrorProps = {
    state: StateHolderNoData;
};
export declare function StateHolderError(p: StateHolderErrorProps): JSX.Element;
export type StateHolder<T> = {
    status: "loading";
    msg?: string;
} | {
    status: "error";
    err: string;
} | {
    status: "ready";
    data: T;
};
type StateHolderWrapperProps<T> = {
    state: StateHolder<T>;
    children: (v: T) => JSX.Element;
    onErrorButton?: {
        label: string;
        onClick: () => void;
    } | {
        label: string;
        link: string;
    };
    noPad?: boolean;
};
export declare function StateHolderWrapper<T>(p: StateHolderWrapperProps<T>): JSX.Element;
export {};
