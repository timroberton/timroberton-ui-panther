export function LabelHolder(p) {
    return (<div class="">
      <div class="pb-1 text-sm text-base-content">{p.label}</div>
      <div class="">{p.children}</div>
    </div>);
}
