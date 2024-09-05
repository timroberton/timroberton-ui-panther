import { JSX } from "solid-js";
export type EditorComponentProps<TProps, TReturn> = TProps & {
    close: (p: TReturn | undefined) => void;
};
type OpenEditorProps<TProps, TReturn> = {
    element: (p: EditorComponentProps<TProps, TReturn>) => JSX.Element;
    props: TProps;
};
type EditorWrapperProps = {
    children: JSX.Element;
};
export declare function getEditorWrapper(): {
    openEditor: <TProps, TReturn>(v: OpenEditorProps<TProps, TReturn>) => Promise<TReturn>;
    EditorWrapper: (p: EditorWrapperProps) => JSX.Element;
};
export {};
