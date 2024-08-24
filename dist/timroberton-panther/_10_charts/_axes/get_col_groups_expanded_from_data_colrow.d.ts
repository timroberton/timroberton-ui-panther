import type { ColGroupExpanded, TimChartDataColRowTransformed } from "../_types/mod.ts";
export declare function getColGroupsExpandedFromDataColRow(data: TimChartDataColRowTransformed): {
    colGroups: ColGroupExpanded[];
    showColGroupLabelsAndBracket: boolean;
};
