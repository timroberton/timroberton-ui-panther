import { JSX, Match, Show, Switch } from "solid-js";
import { Loading } from "./loading_el";
import { Button, Link } from "./button";

export type StateHolderNoData =
  | { status: "loading"; msg?: string }
  | { status: "error"; err: string }
  | { status: "ready" };

type StateHolderErrorProps = {
  state: StateHolderNoData;
};

export function StateHolderError(p: StateHolderErrorProps) {
  return (
    <Show when={p.state.status === "error" && p.state.err} keyed>
      {(keyedErr) => {
        return <div class="text-danger">{keyedErr}</div>;
      }}
    </Show>
  );
}

export type StateHolder<T> =
  | { status: "loading"; msg?: string }
  | { status: "error"; err: string }
  | { status: "ready"; data: T };

type StateHolderWrapperProps<T> = {
  state: StateHolder<T>;
  children: (v: T) => JSX.Element;
  onErrorButton?:
    | {
        label: string;
        onClick: () => void;
      }
    | {
        label: string;
        link: string;
      };
  noPad?: boolean;
};

export function StateHolderWrapper<T>(p: StateHolderWrapperProps<T>) {
  return (
    <div class="h-full w-full">
      <Switch>
        <Match when={p.state.status === "loading"}>
          <Loading msg={(p.state as { msg?: string }).msg} noPad={p.noPad} />
        </Match>
        <Match when={p.state.status === "error"}>
          <div
            class="data-[no-pad=false]:ui-pad ui-space-y"
            data-no-pad={!!p.noPad}
          >
            <div class="text-danger">
              Error: {(p.state as { err: string }).err}
            </div>
            <Switch>
              <Match
                when={
                  (p.onErrorButton as { label: string; onClick: () => void })
                    ?.onClick &&
                  (p.onErrorButton as { label: string; onClick: () => void })
                }
                keyed
              >
                {(keyedOnErr) => {
                  return (
                    <div class="">
                      <Button onClick={keyedOnErr.onClick}>
                        {keyedOnErr.label}
                      </Button>
                    </div>
                  );
                }}
              </Match>
              <Match
                when={
                  (p.onErrorButton as { label: string; link: string })?.link &&
                  (p.onErrorButton as { label: string; link: string })
                }
                keyed
              >
                {(keyedOnErr) => {
                  return (
                    <div class="">
                      <Link href={keyedOnErr.link}>{keyedOnErr.label}</Link>
                    </div>
                  );
                }}
              </Match>
            </Switch>
          </div>
        </Match>
        <Match
          when={p.state.status === "ready" && (p.state as { data: T }).data}
          keyed
        >
          {(keyedData) => p.children(keyedData)}
        </Match>
      </Switch>
    </div>
  );
}
