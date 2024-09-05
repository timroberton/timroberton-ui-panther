import { JSX, Match, Switch } from "solid-js";
import { Loading } from "./loading_el";
import { Button, Link } from "./button";

export type StateHolder<T> =
  | { status: "loading" }
  | { status: "error"; err: string }
  | { status: "ready"; data: T };

type Props<T> = {
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
};

export function StateHolderWrapper<T>(p: Props<T>) {
  return (
    <div class="h-full w-full">
      <Switch>
        <Match when={p.state.status === "loading"}>
          <Loading />
        </Match>
        <Match when={p.state.status === "error"}>
          <div class="ui-pad ui-space-y">
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
