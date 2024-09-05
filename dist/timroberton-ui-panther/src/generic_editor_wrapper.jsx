import { Show, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
export function getEditorWrapper() {
    const [editorState, setEditorState] = createSignal();
    function openEditor(v) {
        return new Promise((resolve, reject) => {
            setEditorState({
                element: v.element,
                props: v.props,
                componentResolver: resolve,
            });
        });
    }
    function EditorWrapper(p) {
        return (<div class="relative z-0 h-full w-full">
        <div class="h-full w-full data-[hidden=true]:hidden" data-hidden={!!editorState()}>
          {p.children}
        </div>
        <Show when={editorState()} keyed>
          {(keyedEditorState) => {
                return (<div class="absolute inset-0 z-10 bg-white">
                <Dynamic component={keyedEditorState.element} close={(p) => {
                        keyedEditorState.componentResolver(p);
                        setEditorState(undefined);
                    }} {...keyedEditorState.props}/>
              </div>);
            }}
        </Show>
      </div>);
    }
    return { openEditor, EditorWrapper };
}
