import { Button as KButton } from "@kobalte/core/button";
import { Link as KLink } from "@kobalte/core/link";
export function Button(p) {
    return (<KButton class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full" onClick={p.onClick} type={p.type} disabled={p.disabled} data-intent={p.intent} autofocus={p.autofocus} form={p.form} data-width={p.fullWidth}>
      {p.children}
    </KButton>);
}
export function Link(p) {
    return (<KLink class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full" href={p.href} disabled={p.disabled} data-intent={p.intent} data-width={p.fullWidth}>
      {p.children}
    </KLink>);
}
