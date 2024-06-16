import * as solid_js from "solid-js";
import { JSX, Setter } from "solid-js";
import { ButtonRootProps } from "@kobalte/core/button";
import { TimChartInputs, RectCoordsDims } from "@jsr/timroberton__panther";
export * from "@jsr/timroberton__panther";
import { CheckboxRootProps } from "@kobalte/core/checkbox";
import { TextFieldRootOptions } from "@kobalte/core/text-field";
import { SliderRootOptions } from "@kobalte/core/slider";

type Intent = "danger" | "primary" | "success" | "neutral";

type OpenAlertInput = {
  title?: string;
  text: string;
  intent?: Intent;
  closeButtonLabel?: string;
};
type OpenConfirmInput = {
  title?: string;
  text: string | JSX.Element;
  intent?: Intent;
  confirmButtonLabel?: string;
};
type OpenPromptInput = {
  initialInputText: string;
  title?: string;
  text?: string;
  inputLabel?: string;
  inputType?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
  intent?: Intent;
  saveButtonLabel?: string;
};
type AlertComponentProps<TProps, TReturn> = TProps & {
  close: (p: TReturn | undefined) => void;
};
type OpenComponentInput<TProps, TReturn> = {
  elementProps: TProps;
  element: (p: AlertComponentProps<TProps, TReturn>) => JSX.Element;
};
declare function openAlert(v: OpenAlertInput): Promise<void>;
declare function openConfirm(v: OpenConfirmInput): Promise<boolean>;
declare function openPrompt(v: OpenPromptInput): Promise<string | undefined>;
declare function openComponent<TProps, TReturn>(
  v: OpenComponentInput<TProps, TReturn>
): Promise<TReturn | undefined>;
declare function AlertProvider(): JSX.Element;

type Props$7 = {
  children: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  type?: ButtonRootProps["type"];
  form?: string;
  disabled?: ButtonRootProps["disabled"];
  autofocus?: boolean;
  intent?: Intent;
};
declare function Button(p: Props$7): JSX.Element;

type Props$6<T extends Object> = {
  getChartInputs: (obj: T) => TimChartInputs;
  getChartRcd?: (obj: T) => RectCoordsDims;
  obj: T;
  aspectRatio?: number;
};
declare function ChartHolderAnimated<T extends Object>(
  p: Props$6<T>
): solid_js.JSX.Element;

type Props$5 = {
  chartInputs: TimChartInputs;
  domH: number;
};
declare function ChartHolderFixedHeight(p: Props$5): solid_js.JSX.Element;

type Props$4 = {
  chartInputs: TimChartInputs;
};
declare function ChartHolderFlex(p: Props$4): solid_js.JSX.Element;

type Props$3 = {
  checked: CheckboxRootProps["checked"];
  onChange?: CheckboxRootProps["onChange"];
  label: string;
};
declare function Checkbox(p: Props$3): solid_js.JSX.Element;

type ContainerProps = {
  children: JSX.Element;
};
type FrameProps = {
  panelChildren?: JSX.Element;
  children: JSX.Element;
};
declare function ContainerFrameSideOrTop_700px(p: FrameProps): JSX.Element;
declare function ContainerHorizontalVertival_300px(
  p: ContainerProps
): JSX.Element;
declare function FrameSide(p: FrameProps): JSX.Element;
declare function FrameTop(p: FrameProps): JSX.Element;
declare function FrameSideOrTop_Md(p: FrameProps): JSX.Element;
declare function FrameSideOrTop_Lg(p: FrameProps): JSX.Element;
declare function FrameSideOrTop_Xl(p: FrameProps): JSX.Element;
type FrameMenuProps = {
  tabs: Tab[];
  setter: Setter<string>;
  selected: string;
  children: JSX.Element;
  sideTabs?: Tab[];
};
type Tab = {
  id: string;
  label: string;
};
declare function FrameSideMenu(p: FrameMenuProps): JSX.Element;
declare function FrameSideMenuSecondary(p: FrameMenuProps): JSX.Element;
declare function FrameTopMenu(p: FrameMenuProps): JSX.Element;

type Props$2 = {
  value: TextFieldRootOptions["value"];
  onChange?: TextFieldRootOptions["onChange"];
  label?: string;
  intent?: Intent;
  autofocus?: boolean;
  fullWidth?: boolean;
};
declare function Input(p: Props$2): solid_js.JSX.Element;

type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};
type Props$1<T extends string | number> = {
  value: T | undefined;
  options: SelectOption<T>[];
  onChange: (v: T) => void;
  placeholder?: string;
  intent?: Intent;
  label?: string;
  fullWidth?: boolean;
};
declare function Select<T extends string | number>(
  p: Props$1<T>
): solid_js.JSX.Element;

type Props = {
  value: SliderRootOptions["value"];
  onChange?: SliderRootOptions["onChange"];
  minValue?: SliderRootOptions["minValue"];
  maxValue?: SliderRootOptions["maxValue"];
  step?: SliderRootOptions["step"];
  label: string;
  valFormatter?: (v: number) => string;
};
declare function Slider(p: Props): solid_js.JSX.Element;

export {
  type AlertComponentProps,
  AlertProvider,
  Button,
  ChartHolderAnimated,
  ChartHolderFixedHeight,
  ChartHolderFlex,
  Checkbox,
  ContainerFrameSideOrTop_700px,
  ContainerHorizontalVertival_300px,
  FrameSide,
  FrameSideMenu,
  FrameSideMenuSecondary,
  FrameSideOrTop_Lg,
  FrameSideOrTop_Md,
  FrameSideOrTop_Xl,
  FrameTop,
  FrameTopMenu,
  Input,
  Select,
  type SelectOption,
  Slider,
  openAlert,
  openComponent,
  openConfirm,
  openPrompt,
};
