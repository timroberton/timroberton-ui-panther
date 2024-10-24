import { For, Show } from "solid-js";
export function getSelectOptions(arr) {
    return arr.map((v) => {
        return { value: v, label: v };
    });
}
export function getSelectOptionsFromIdLabel(arr) {
    return arr.map((v) => {
        return { value: v.id, label: v.label };
    });
}
export function Select(p) {
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
      <div class="relative w-full">
        <select ref={af} value={p.value} onChange={(e) => p.onChange(e.currentTarget.value)} class="ui-never-focusable w-full appearance-none cursor-pointer rounded border border-base-300 truncate bg-base-100 py-2 pl-4 pr-10 align-middle text-base text-base-content font-400" autofocus={p.autoFocus}>
          <For each={p.options}>
            {(opt) => {
            return <option value={opt.value}>{opt.label}</option>;
        }}
          </For>
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute right-2 my-auto top-0 bottom-0 pointer-events-none text-base-content" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M8 9l4 -4l4 4"/>
          <path d="M16 15l-4 4l-4 -4"/>
        </svg>
      </div>
      <Show when={p.invalidMsg} keyed>
        {(keyedInvalidMsg) => {
            return (<div class="pt-1 text-xs text-danger inline-block">
              {keyedInvalidMsg}
            </div>);
        }}
      </Show>
    </div>);
}
