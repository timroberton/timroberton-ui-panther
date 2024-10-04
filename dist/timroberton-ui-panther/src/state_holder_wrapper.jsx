import { Match, Show, Switch } from "solid-js";
import { Loading } from "./loading_el";
import { Button, Link } from "./button";
export function StateHolderError(p) {
    return (<Show when={p.state.status === "error" && p.state.err} keyed>
      {(keyedErr) => {
            return <div class="text-danger">{keyedErr}</div>;
        }}
    </Show>);
}
export function StateHolderWrapper(p) {
    return (<div class="h-full w-full">
      <Switch>
        <Match when={p.state.status === "loading"}>
          <Loading msg={p.state.msg}/>
        </Match>
        <Match when={p.state.status === "error"}>
          <div class="ui-pad ui-space-y">
            <div class="text-danger">
              Error: {p.state.err}
            </div>
            <Switch>
              <Match when={p.onErrorButton
            ?.onClick &&
            p.onErrorButton} keyed>
                {(keyedOnErr) => {
            return (<div class="">
                      <Button onClick={keyedOnErr.onClick}>
                        {keyedOnErr.label}
                      </Button>
                    </div>);
        }}
              </Match>
              <Match when={p.onErrorButton?.link &&
            p.onErrorButton} keyed>
                {(keyedOnErr) => {
            return (<div class="">
                      <Link href={keyedOnErr.link}>{keyedOnErr.label}</Link>
                    </div>);
        }}
              </Match>
            </Switch>
          </div>
        </Match>
        <Match when={p.state.status === "ready" && p.state.data} keyed>
          {(keyedData) => p.children(keyedData)}
        </Match>
      </Switch>
    </div>);
}
