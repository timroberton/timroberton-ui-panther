import { JSX, Show } from "solid-js";

type Props = {
  heading: string;
  children: JSX.Element;
  leftChildren?: JSX.Element;
};

export function HeadingBar(p: Props) {
  return (
    <div class="ui-pad ui-gap flex w-full items-center border-b">
      <Show when={p.leftChildren} keyed>
        {(keyedLeftChildren) => {
          return <div class="flex-none">{keyedLeftChildren}</div>;
        }}
      </Show>
      <div class="flex-1 text-lg font-700">{p.heading}</div>
      <div class="flex-none">{p.children}</div>
    </div>
  );
}
