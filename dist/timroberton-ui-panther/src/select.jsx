import { Select as KSelect } from "@kobalte/core/select";
import { Show } from "solid-js";
export function Select(p) {
    const selectedValue = () => p.options.find((so) => so.value === p.value);
    const onChangeHandler = (so) => so !== null && p.onChange(so.value);
    return (<KSelect value={selectedValue()} onChange={onChangeHandler} options={p.options} optionValue="value" optionTextValue="label" placeholder={p.placeholder ?? "Unselected"} class="inline-flex w-[200px] flex-col align-middle text-base-content data-[width=true]:w-full" data-width={p.fullWidth} itemComponent={(props) => (<KSelect.Item item={props.item} class="ui-never-focusable ui-hoverable flex cursor-pointer select-none items-center justify-between rounded bg-base-100 py-2 pl-4 pr-4 text-base font-400 focus-visible:bg-base-200">
          <KSelect.ItemLabel class="truncate pr-2">
            {props.item.rawValue.label}
          </KSelect.ItemLabel>
          <KSelect.ItemIndicator>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M5 12l5 5l10 -10"/>
            </svg>
          </KSelect.ItemIndicator>
        </KSelect.Item>)}>
      <Show when={p.label} keyed>
        {(keyedLabel) => {
            return (<KSelect.Label class="pb-1 text-sm text-base-content" data-intent={p.intent}>
              {keyedLabel}
            </KSelect.Label>);
        }}
      </Show>
      <KSelect.Trigger aria-label="Fruit" class="ui-focusable inline-flex w-full select-none items-center justify-between rounded border border-base-300 bg-base-100 py-2 pl-4 pr-2 align-middle text-base font-400">
        <KSelect.Value class="truncate pr-2 ui-placeholder-shown:text-danger">
          {(state) => state.selectedOption().label}
        </KSelect.Value>
        <KSelect.Icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M8 9l4 -4l4 4"/>
            <path d="M16 15l-4 4l-4 -4"/>
          </svg>
        </KSelect.Icon>
      </KSelect.Trigger>
      <KSelect.Portal>
        <KSelect.Content class="rounded bg-base-100 shadow-lg">
          <KSelect.Listbox class="max-h-[300px] overflow-y-auto"/>
        </KSelect.Content>
      </KSelect.Portal>
    </KSelect>);
}
