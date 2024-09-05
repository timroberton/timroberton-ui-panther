import { Csv } from "../deps";
import { withAnyLabelReplacement } from "./with_any_label_replacement";
export function getChartDataXYTransformed(d, horizontal) {
    if (typeof d.csv === "string") {
        throw new Error("String CSV does not work in browser");
    }
    const csv = new Csv(d.csv)
        .getNumbers()
        .getWithPointEstimateBounds(d.uncertaintyBounds ?? "none")
        .getTransposed(!!d.transpose);
    if (csv.colHeaders() === "none") {
        throw new Error("Cannot have colHeaders none");
    }
    if (horizontal) {
        return {
            series: getSeriesFromCsv(csv, d.yColNumber, d.xColNumber, d.labelReplacements),
            //
            xAxisLabel: d.yAxisLabel,
            yAxisLabel: d.xAxisLabel,
            //
            dataLabelPositionMap: d.dataLabelPositionMap,
            lineFunction: d.lineFunction,
            legendItems: d.legendItems,
        };
    }
    return {
        series: getSeriesFromCsv(csv, d.xColNumber, d.yColNumber, d.labelReplacements),
        //
        xAxisLabel: d.xAxisLabel,
        yAxisLabel: d.yAxisLabel,
        //
        dataLabelPositionMap: d.dataLabelPositionMap,
        lineFunction: d.lineFunction,
        legendItems: d.legendItems,
    };
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function getSeriesFromCsv(csv, xColNumber, yColNumber, labelReplacements) {
    const rowHeadersWithLabelReplacements = csv.rowHeaders() === "none"
        ? "none"
        : withAnyLabelReplacement(csv.rowHeadersOrThrowIfNone(), labelReplacements);
    return [
        {
            label: "Series 1",
            values: csv.aoa().map((row, i_row) => {
                return {
                    label: rowHeadersWithLabelReplacements === "none"
                        ? undefined
                        : rowHeadersWithLabelReplacements[i_row],
                    x: row[xColNumber - 1],
                    y: row[yColNumber - 1],
                };
            }),
        },
    ];
}
