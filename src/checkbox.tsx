import { For, JSX, Match, Show, Switch } from "solid-js";
import { SelectOption } from "./select";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string | JSX.Element;
};

export function Checkbox(p: CheckboxProps) {
  return (
    <div class="">
      <label class="inline-flex items-center align-top">
        <div class="relative flex-none w-5 h-5 mr-2">
          <input
            checked={p.checked}
            type="checkbox"
            onChange={(v) => p.onChange(v.currentTarget.checked)}
            class="peer ui-focusable appearance-none h-5 w-5 cursor-pointer rounded border border-base-300 bg-base-100 text-base-content"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 absolute inset-0.5 pointer-events-none peer-checked:block hidden text-base-content"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </div>
        <Switch>
          <Match when={typeof p.label === "string"}>
            <span class="select-none">{p.label}</span>
          </Match>
          <Match when={true}>{p.label}</Match>
        </Switch>
      </label>
    </div>
  );
}

type RadioGroupProps<T extends string> = {
  value: T | undefined;
  options: SelectOption<T>[];
  onChange: (v: string) => void;
  label?: string | JSX.Element;
  horizontal?: boolean;
};

export function RadioGroup<T extends string>(p: RadioGroupProps<T>) {
  return (
    <div class="">
      <Show when={p.label} keyed>
        {(keyedLabel) => {
          return (
            <legend class="pb-1 text-sm text-base-content inline-block">
              {keyedLabel}
            </legend>
          );
        }}
      </Show>
      <div
        class="data-[horizontal=false]:space-y-1 data-[horizontal=true]:flex data-[horizontal=true]:items-center data-[horizontal=true]:gap-3"
        data-horizontal={!!p.horizontal}
      >
        <For each={p.options}>
          {(opt) => {
            return (
              <div class="">
                <label class="inline-flex items-center align-top">
                  <div class="relative flex-none w-5 h-5 mr-2">
                    <input
                      checked={opt.value === p.value}
                      type="radio"
                      onChange={() => p.onChange(opt.value)}
                      class="peer ui-focusable appearance-none h-5 w-5 cursor-pointer rounded-full border border-base-300 bg-base-100 text-base-content"
                    />
                    <div class="h-3 w-3 absolute rounded-full inset-1 pointer-events-none peer-checked:block hidden bg-base-content" />
                  </div>
                  <Switch>
                    <Match when={typeof opt.label === "string"}>
                      <span class="select-none">{opt.label}</span>
                    </Match>
                    <Match when={true}>{opt.label}</Match>
                  </Switch>
                </label>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
