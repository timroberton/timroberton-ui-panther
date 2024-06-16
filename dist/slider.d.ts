import { SliderRootOptions } from "@kobalte/core/slider";
type Props = {
    value: SliderRootOptions["value"];
    onChange?: SliderRootOptions["onChange"];
    minValue?: SliderRootOptions["minValue"];
    maxValue?: SliderRootOptions["maxValue"];
    step?: SliderRootOptions["step"];
    label: string;
    valFormatter?: (v: number) => string;
};
export declare function Slider(p: Props): import("solid-js").JSX.Element;
export {};
