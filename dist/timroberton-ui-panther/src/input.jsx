import { Show } from "solid-js";
export function Input(p) {
    function af(el) {
        if (p.autoFocus) {
            setTimeout(() => el.focus());
        }
    }
    return (<div class="w-[200px] data-[width=true]:w-full" data-width={p.fullWidth}>
      <Show when={p.label} keyed>
        {(keyedLabel) => {
            return (<label class="pb-1 text-sm text-base-content inline-block" data-intent={p.intent}>
              {keyedLabel}
            </label>);
        }}
      </Show>
      <input ref={af} class="ui-focusable inline-flex w-full appearance-none rounded border border-base-300 bg-base-100 px-4 py-2 align-middle text-base text-base-content font-400" data-intent={p.intent} autofocus={p.autoFocus} type={p.type} onChange={(v) => p.onChange(v.currentTarget.value)} value={p.value}/>
    </div>);
}
