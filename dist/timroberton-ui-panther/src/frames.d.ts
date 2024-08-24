import { JSX, Setter } from "solid-js";
type ContainerProps = {
    children: JSX.Element;
};
type FrameProps = {
    panelChildren?: JSX.Element;
    children: JSX.Element;
};
export declare function ContainerFrameSideOrTop_700px(p: FrameProps): JSX.Element;
export declare function ContainerHorizontalVertival_300px(p: ContainerProps): JSX.Element;
export declare function FrameSide(p: FrameProps): JSX.Element;
export declare function FrameTop(p: FrameProps): JSX.Element;
export declare function FrameSideOrTop_Md(p: FrameProps): JSX.Element;
export declare function FrameSideOrTop_Lg(p: FrameProps): JSX.Element;
export declare function FrameSideOrTop_Xl(p: FrameProps): JSX.Element;
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
export declare function FrameSideMenu(p: FrameMenuProps): JSX.Element;
export declare function FrameSideMenuSecondary(p: FrameMenuProps): JSX.Element;
export declare function FrameTopMenu(p: FrameMenuProps): JSX.Element;
export {};
