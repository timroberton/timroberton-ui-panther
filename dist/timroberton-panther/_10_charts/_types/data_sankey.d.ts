import type { ColorKeyOrString, LegendItem } from "../deps";
export type TimChartDataSankey = {
    streams: SankeyStream[];
    cols: SankeyCol[];
    alignments: SankeyAlignment[];
    legendItems?: LegendItem[];
};
export type SankeyStream = {
    from: string;
    to: string | "jut";
    pctOfFrom: number;
    color: ColorKeyOrString;
};
export type SankeyCol = {
    items: SankeyColItem[];
};
export type SankeyColItem = {
    id: string;
    color?: ColorKeyOrString;
    showPctLabel?: boolean;
    label: string | undefined;
    maxLabelWidth?: number;
    invisibleLabel?: boolean;
    labelAlign?: "right";
    pctOfStarting?: number;
    toBottom?: boolean;
    widthOverride?: number;
    gapBelowOverride?: number;
    alignment?: string;
};
export type SankeyAlignment = {
    id: string;
    topOrBottom: "top" | "bottom";
};
