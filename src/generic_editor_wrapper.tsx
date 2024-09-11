import { JSX, Match, Show, Switch, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";

export type EditorComponentProps<TProps, TReturn> = TProps & {
  close: (p: TReturn | undefined) => void;
};

export type OpenEditorProps<TProps, TReturn> = {
  element: (p: EditorComponentProps<TProps, TReturn>) => JSX.Element;
  props: TProps;
};

type EditorState<TProps, TReturn> = {
  element: (p: EditorComponentProps<TProps, TReturn>) => JSX.Element;
  props: TProps;
  componentResolver: (p: TReturn | undefined) => void;
};

type EditorWrapperProps = {
  children: JSX.Element;
};

export function getEditorWrapper() {
  const [editorState, setEditorState] = createSignal<
    EditorState<any, any> | undefined
  >();
  function openEditor<TProps, TReturn>(v: OpenEditorProps<TProps, TReturn>) {
    return new Promise<TReturn | undefined>(
      (resolve: (p: TReturn | undefined) => void, reject) => {
        setEditorState({
          element: v.element,
          props: v.props,
          componentResolver: resolve,
        });
      }
    );
  }
  function EditorWrapper(p: EditorWrapperProps) {
    return (
      <div class="relative z-0 h-full w-full">
        <div
          class="h-full w-full data-[hidden=true]:hidden"
          data-hidden={!!editorState()}
        >
          {p.children}
        </div>
        <Show when={editorState()} keyed>
          {(keyedEditorState) => {
            return (
              <div class="absolute inset-0 z-10 bg-white">
                <Dynamic
                  component={keyedEditorState.element}
                  close={(p: unknown) => {
                    keyedEditorState.componentResolver(p);
                    setEditorState(undefined);
                  }}
                  {...keyedEditorState.props}
                />
              </div>
            );
          }}
        </Show>
      </div>
    );
  }
  return { openEditor, EditorWrapper };
}
