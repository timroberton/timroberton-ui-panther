import {
  TextField as KInput,
  TextFieldRootOptions,
} from "@kobalte/core/text-field";
import { Show } from "solid-js";
import { Intent } from "./types";

type Props = {
  value: TextFieldRootOptions["value"];
  onChange?: TextFieldRootOptions["onChange"];
  label?: string;
  intent?: Intent;
  autofocus?: boolean;
  fullWidth?: boolean;
};

export function Input(p: Props) {
  return (
    <KInput
      class="inline-flex w-[200px] flex-col align-middle data-[width=true]:w-full"
      value={p.value}
      data-width={p.fullWidth}
      onChange={p.onChange}
    >
      <Show when={p.label} keyed>
        {(keyedLabel) => {
          return (
            <KInput.Label class="text-base-content" data-intent={p.intent}>
              {keyedLabel}
            </KInput.Label>
          );
        }}
      </Show>
      <KInput.Input
        class="ui-focusable inline-flex w-full appearance-none rounded border border-base-300 bg-base-100 px-4 py-2 align-middle text-base text-base-content"
        data-intent={p.intent}
        autofocus={p.autofocus}
      />
    </KInput>
  );
}
