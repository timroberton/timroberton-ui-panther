import { Slider as KSlider } from "@kobalte/core/slider";
export function Slider(p) {
    return (<KSlider class="flex select-none flex-col" value={p.value} onChange={p.onChange} minValue={p.minValue ?? 0} maxValue={p.maxValue ?? 1} step={p.step ?? 0.01} getValueLabel={p.valFormatter
            ? (params) => params.values.map((v) => p.valFormatter(v)).join(", ")
            : undefined}>
      <KSlider.Label class="text-base-content">{p.label}</KSlider.Label>
      <KSlider.ValueLabel class="pb-2 text-base-content"/>
      <KSlider.Track class="relative h-2 w-full cursor-pointer rounded-full bg-base-300">
        <KSlider.Fill class="absolute h-full cursor-pointer rounded-full backdrop-brightness-75"/>
        <KSlider.Thumb class="ui-focusable ui-hoverable -top-1 block h-4 w-4 cursor-pointer rounded-full bg-base-content">
          <KSlider.Input />
        </KSlider.Thumb>
      </KSlider.Track>
    </KSlider>);
}
