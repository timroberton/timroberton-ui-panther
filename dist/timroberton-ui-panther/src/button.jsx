import { Show } from "solid-js";
import { Spinner } from "./loading_el";
export function Button(p) {
    return (<button class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full" onClick={p.onClick} type={p.type} disabled={p.disabled} data-intent={p.intent} autofocus={p.autofocus} form={p.form} data-width={p.fullWidth}>
      <Show when={p.loading || p.state?.status === "loading"}>
        <span class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <Spinner />
        </span>
      </Show>
      <span class="data-[loading=true]:invisible relative" data-loading={p.loading || p.state?.status === "loading"}>
        {p.children}
      </span>
    </button>);
}
export function Link(p) {
    return (<a class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full" href={p.href} data-intent={p.intent} data-width={p.fullWidth}>
      <span class="relative">{p.children}</span>
    </a>);
}
