import { JSX } from "solid-js";
import { Intent } from "./types";

type ButtonProps = {
  children: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  type?: HTMLButtonElement["type"];
  form?: string;
  disabled?: HTMLButtonElement["disabled"];
  autofocus?: boolean;
  intent?: Intent;
  fullWidth?: boolean;
};

export function Button(p: ButtonProps) {
  return (
    <button
      class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full"
      onClick={p.onClick}
      type={p.type}
      disabled={p.disabled}
      data-intent={p.intent}
      autofocus={p.autofocus}
      form={p.form}
      data-width={p.fullWidth}
    >
      {p.children}
    </button>
  );
}

type LinkProps = {
  children: JSX.Element;
  href: string;
  intent?: Intent;
  fullWidth?: boolean;
};

export function Link(p: LinkProps) {
  return (
    <a
      class="ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content data-[width=true]:w-full"
      href={p.href}
      data-intent={p.intent}
      data-width={p.fullWidth}
    >
      {p.children}
    </a>
  );
}
