import { Csv } from "../deps";
import { withAnyLabelReplacement } from "./with_any_label_replacement";
export function getChartDataColRowTransformed(d) {
    if (typeof d.csv === "string") {
        throw new Error("String CSV does not work in browser");
    }
    const csv = new Csv(d.csv)
        .getSortedRowsByCol(d.sortRows?.colNumberOrHeader, d.sortRows?.direction)
        .getSortedColsByRow(d.sortCols?.rowNumberOrHeader, d.sortCols?.direction)
        .getSelectedCols(d.colNumbersOrHeadersToTake)
        .getSelectedRows(d.rowNumbersOrHeadersToTake)
        .getNumbers()
        .getWithPointEstimateBounds(d.uncertaintyBounds ?? "none")
        .getTransposed(!!d.transpose);
    if (csv.colHeaders() === "none") {
        throw new Error("Cannot have colHeaders none");
    }
    if (csv.rowHeaders() === "none" && csv.aoa.length > 1) {
        throw new Error("Cannot have rowHeaders none and more than one row");
    }
    return {
        colHeaders: withAnyLabelReplacement(csv.colHeadersOrThrowIfNone(), d.labelReplacements),
        rowHeaders: csv.rowHeaders() === "none"
            ? ["DUMMY"]
            : withAnyLabelReplacement(csv.rowHeadersOrThrowIfNone(), d.labelReplacements),
        aoa: csv.aoa(),
        //
        scaleAxisLabel: d.scaleAxisLabel,
        textAxisLabel: d.textAxisLabel,
        colGroups: getGolGroupsNumberOnly(d.colGroups, csv.colHeadersOrThrowIfNone(), d.labelReplacements),
        legendItems: d.legendItems,
    };
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function getGolGroupsNumberOnly(colGroups, colHeaders, labelReplacements) {
    if (!colGroups) {
        return undefined;
    }
    if (colGroups.length === 0) {
        throw new Error("Col groups can't be zero array");
    }
    if (colGroups[0].colNumbers !== undefined) {
        return colGroups;
    }
    return colGroups.map((c) => {
        return {
            label: c.label === undefined
                ? undefined
                : withAnyLabelReplacement(c.label, labelReplacements),
            colNumbers: c.colHeaders.map((ch) => {
                const index = colHeaders.indexOf(ch);
                if (index === -1) {
                    console.log(colGroups, colHeaders);
                    throw new Error("Col groups col header is not in colHeaders");
                }
                return index + 1;
            }),
        };
    });
}
