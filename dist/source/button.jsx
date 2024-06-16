import { Button as KButton } from "@kobalte/core/button";
export function Button(p) {
    return (<KButton class="ui-button" onClick={p.onClick} type={p.type} disabled={p.disabled} data-intent={p.intent} autofocus={p.autofocus} form={p.form}>
      {p.children}
    </KButton>);
}
