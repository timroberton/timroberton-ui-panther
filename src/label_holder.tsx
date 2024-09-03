import { JSX } from "solid-js";

type Props = {
  label?: string;
  children: JSX.Element;
};

export function LabelHolder(p: Props) {
  return (
    <div class="">
      <div class="pb-1 text-sm text-base-content">{p.label}</div>
      <div class="">{p.children}</div>
    </div>
  );
}
