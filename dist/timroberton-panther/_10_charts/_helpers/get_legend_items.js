export function getLegendItemsColRow(chartData, legendItemsSource, paletteColors, palettePointStyles) {
    const optLegendItems = chartData.legendItems?.map((li) => {
        return {
            label: li.label,
            color: li.color,
            pointStyle: li.pointStyle,
        };
    });
    const optData = chartData.rowHeaders.map((label, i_row) => {
        return {
            label,
            color: paletteColors.paletteType === "by-row"
                ? paletteColors.colors[i_row]
                : paletteColors.paletteType === "by-col"
                    ? paletteColors.colors[0]
                    : paletteColors.paletteType === "func"
                        ? paletteColors.func(i_row, -1, -1, -1)
                        : paletteColors.color,
            pointStyle: palettePointStyles
                ? palettePointStyles.paletteType === "by-row"
                    ? palettePointStyles.pointStyles[i_row]
                    : palettePointStyles.paletteType === "by-col"
                        ? palettePointStyles.pointStyles[0]
                        : palettePointStyles.pointStyle
                : undefined,
        };
    });
    switch (legendItemsSource) {
        case "default": {
            const legendItems = optLegendItems ?? optData;
            if (legendItems.length > 1) {
                return legendItems;
            }
            return [];
        }
        case "only-data":
            return optData;
        case "only-legend-items":
            return optLegendItems ?? [];
        case "both-data-first":
            return [...optData, ...(optLegendItems ?? [])];
        case "both-legend-items-first":
            return [...(optLegendItems ?? []), ...optData];
    }
}
export function getLegendItemsXY(chartData, paletteColors, palettePointStyles) {
    return chartData.series.map((ser, i_row) => {
        return {
            label: ser.label ?? "Series has no name",
            color: paletteColors.paletteType === "by-row"
                ? paletteColors.colors[i_row]
                : paletteColors.paletteType === "by-col"
                    ? paletteColors.colors[0]
                    : paletteColors.paletteType === "func"
                        ? paletteColors.func(i_row, -1, -1, -1)
                        : paletteColors.color,
            pointStyle: palettePointStyles
                ? palettePointStyles.paletteType === "by-row"
                    ? palettePointStyles.pointStyles[i_row]
                    : palettePointStyles.paletteType === "by-col"
                        ? palettePointStyles.pointStyles[0]
                        : palettePointStyles.pointStyle
                : undefined,
        };
    });
}
export function getLegendItemsSankey(chartData, paletteColors) {
    if (chartData.legendItems) {
        return chartData.legendItems.map((li) => {
            return {
                label: li.label,
                color: li.color,
                pointStyle: undefined,
            };
        });
    }
    return [].map((label, i_row) => {
        return {
            label,
            color: paletteColors.paletteType === "by-row"
                ? paletteColors.colors[i_row]
                : paletteColors.paletteType === "by-col"
                    ? paletteColors.colors[0]
                    : paletteColors.paletteType === "func"
                        ? paletteColors.func(i_row, -1, -1, -1)
                        : paletteColors.color,
            pointStyle: undefined,
        };
    });
}
