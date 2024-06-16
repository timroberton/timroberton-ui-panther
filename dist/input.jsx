import { TextField as KInput, } from "@kobalte/core/text-field";
import { Show } from "solid-js";
export function Input(p) {
    return (<KInput class="inline-flex w-[200px] flex-col align-middle data-[width=true]:w-full" value={p.value} data-width={p.fullWidth} onChange={p.onChange}>
      <Show when={p.label} keyed>
        {(keyedLabel) => {
            return (<KInput.Label class="text-base-content" data-intent={p.intent}>
              {keyedLabel}
            </KInput.Label>);
        }}
      </Show>
      <KInput.Input class="ui-input" data-intent={p.intent} autofocus={p.autofocus}/>
    </KInput>);
}
