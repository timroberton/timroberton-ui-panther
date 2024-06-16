import { Button as KButton } from "@kobalte/core/button";
export function Button(p) {
    return (<KButton class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content" onClick={p.onClick} type={p.type} disabled={p.disabled} data-intent={p.intent} autofocus={p.autofocus} form={p.form}>
      {p.children}
    </KButton>);
}
