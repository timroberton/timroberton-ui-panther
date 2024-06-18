import { For, Show, children } from "solid-js";
export function ContainerFrameSideOrTop_700px(p) {
    const paneChildren = children(() => p.panelChildren);
    const mainChildren = children(() => p.children);
    return (<div class="h-full w-full @container">
      <div class="flex h-full w-full flex-col @[700px]:flex-row">
        <Show when={paneChildren()} keyed>
          {(panel) => {
            return (<div class="w-full flex-none @[700px]:h-full @[700px]:w-auto">
                {panel}
              </div>);
        }}
        </Show>
        <div class="h-0 w-full flex-1 @[700px]:h-full @[700px]:w-0">
          {mainChildren()}
        </div>
      </div>
    </div>);
}
export function ContainerHorizontalVertival_300px(p) {
    return (<div class="h-full w-full @container">
      <div class="@[300px]:ui-space-x h-full w-full @[300px]:flex">
        {p.children}
      </div>
    </div>);
}
export function FrameSide(p) {
    return (<div class="flex h-full w-full">
      <div class="h-full flex-none overflow-auto">{p.panelChildren}</div>
      <div class="h-full w-0 flex-1 overflow-auto">{p.children}</div>
    </div>);
}
export function FrameTop(p) {
    const paneChildren = children(() => p.panelChildren);
    const mainChildren = children(() => p.children);
    return (<div class="flex h-full w-full flex-col">
      <Show when={paneChildren()} keyed>
        {(panel) => {
            return <div class="w-full flex-none overflow-auto">{panel}</div>;
        }}
      </Show>
      <div class="h-0 w-full flex-1 overflow-auto">{mainChildren()}</div>
    </div>);
}
export function FrameSideOrTop_Md(p) {
    const paneChildren = children(() => p.panelChildren);
    const mainChildren = children(() => p.children);
    return (<div class="flex h-full w-full flex-col md:flex-row">
      <Show when={paneChildren()} keyed>
        {(panel) => {
            return (<div class="w-full flex-none md:h-full md:w-auto overflow-auto">
              {panel}
            </div>);
        }}
      </Show>
      <div class="h-0 w-full flex-1 md:h-full md:w-0 overflow-auto">
        {mainChildren()}
      </div>
    </div>);
}
export function FrameSideOrTop_Lg(p) {
    return (<div class="flex h-full w-full flex-col lg:flex-row">
      <Show when={p.panelChildren} keyed>
        {(panel) => {
            return (<div class="w-full flex-none lg:h-full lg:w-auto overflow-auto">
              {panel}
            </div>);
        }}
      </Show>
      <div class="h-0 w-full flex-1 lg:h-full lg:w-0 overflow-auto">
        {p.children}
      </div>
    </div>);
}
export function FrameSideOrTop_Xl(p) {
    return (<div class="flex h-full w-full flex-col xl:flex-row">
      <Show when={p.panelChildren} keyed>
        {(panel) => {
            return (<div class="w-full flex-none xl:h-full xl:w-auto overflow-auto">
              {panel}
            </div>);
        }}
      </Show>
      <div class="h-0 w-full flex-1 xl:h-full xl:w-0 overflow-auto">
        {p.children}
      </div>
    </div>);
}
export function FrameSideMenu(p) {
    return (<div class="flex h-full w-full">
      <div class="h-full flex-none bg-base-content text-base-300 overflow-auto">
        <For each={p.tabs}>
          {(tab) => {
            return (<div class={`cursor-pointer select-none p-3 ${p.selected === tab.id
                    ? "bg-base-content-focus text-base-100 underline"
                    : "ui-hoverable"}`} onClick={() => p.setter(tab.id)}>
                {tab.label}
              </div>);
        }}
        </For>
      </div>
      <div class="h-full w-0 flex-1 overflow-auto">{p.children}</div>
    </div>);
}
export function FrameSideMenuSecondary(p) {
    return (<div class="flex h-full w-full">
      <div class="h-full flex-none space-y-3 bg-base-200 p-3 text-base-content-lighter overflow-auto">
        <For each={p.tabs}>
          {(tab) => {
            return (<div class={`cursor-pointer select-none rounded-full px-3 py-1.5 ${p.selected === tab.id
                    ? "bg-base-300 text-base-content"
                    : "ui-hoverable"}`} onClick={() => p.setter(tab.id)}>
                {tab.label}
              </div>);
        }}
        </For>
      </div>
      <div class="h-full w-0 flex-1 overflow-auto">{p.children}</div>
    </div>);
}
export function FrameTopMenu(p) {
    return (<div class="flex h-full w-full flex-col">
      <div class="flex w-full flex-none bg-base-content-lighter text-base-300 overflow-auto">
        <For each={p.tabs}>
          {(tab) => {
            return (<div class={`cursor-pointer select-none p-3 ${p.selected === tab.id
                    ? "bg-base-content-lighter-focus text-base-100 underline"
                    : "ui-hoverable"}`} onClick={() => p.setter(tab.id)}>
                {tab.label}
              </div>);
        }}
        </For>
        <div class="flex-1"></div>
        <For each={p.sideTabs}>
          {(sideTab) => {
            return (<div class={`cursor-pointer select-none p-3 ${p.selected === sideTab.id
                    ? "bg-base-content-lighter-focus text-base-100 underline"
                    : "ui-hoverable"}`} onClick={() => p.setter(sideTab.id)}>
                {sideTab.label}
              </div>);
        }}
        </For>
      </div>
      <div class="h-0 w-full flex-1 overflow-auto">{p.children}</div>
    </div>);
}
