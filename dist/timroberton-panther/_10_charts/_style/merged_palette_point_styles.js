export function getMergedPalettePointStylesColRow(data, cs) {
    const s = cs.getMergedPalettePointStylesStyle();
    if (s.logic === "single") {
        return {
            paletteType: "single",
            pointStyle: s.single,
        };
    }
    if (s.logic === "specific-by-row") {
        if (s.specific.length !== data.rowHeaders.length) {
            throw new Error("Specific palette does not match rowHeaders");
        }
        return {
            paletteType: "by-row",
            pointStyles: s.specific,
        };
    }
    if (s.logic === "specific-by-col") {
        if (s.specific.length !== data.colHeaders.length) {
            throw new Error("Specific palette does not match colHeaders");
        }
        return {
            paletteType: "by-col",
            pointStyles: s.specific,
        };
    }
    if (s.logic === "auto-by-row") {
        return {
            paletteType: "by-row",
            pointStyles: getAutoPointStyles(s.auto, data.rowHeaders.length),
        };
    }
    if (s.logic === "auto-by-col") {
        return {
            paletteType: "by-col",
            pointStyles: getAutoPointStyles(s.auto, data.colHeaders.length),
        };
    }
    throw new Error("Should not be possible");
}
export function getMergedPalettePointStylesXY(data, cs) {
    const s = cs.getMergedPalettePointStylesStyle();
    const maxSeriesLength = Math.max(...data.series.map((ser) => ser.values.length));
    if (s.logic === "single") {
        return {
            paletteType: "single",
            pointStyle: s.single,
        };
    }
    if (s.logic === "specific-by-row") {
        if (s.specific.length !== data.series.length) {
            throw new Error("Specific palette does not match series");
        }
        return {
            paletteType: "by-row",
            pointStyles: s.specific,
        };
    }
    if (s.logic === "specific-by-col") {
        if (s.specific.length !== maxSeriesLength) {
            throw new Error("Specific palette does not match colHeaders");
        }
        return {
            paletteType: "by-col",
            pointStyles: s.specific,
        };
    }
    if (s.logic === "auto-by-row") {
        return {
            paletteType: "by-row",
            pointStyles: getAutoPointStyles(s.auto, data.series.length),
        };
    }
    if (s.logic === "auto-by-col") {
        return {
            paletteType: "by-col",
            pointStyles: getAutoPointStyles(s.auto, maxSeriesLength),
        };
    }
    throw new Error("Should not be possible");
}
export function getMergedPalettePointStylesSankey(data, cs) {
    const s = cs.getMergedPalettePointStylesStyle();
    return {
        paletteType: "single",
        pointStyle: s.single,
    };
}
export function getAutoPointStyles(pointStyles, nPoints) {
    const nAutoPointStyles = pointStyles.length;
    return new Array(nPoints).fill(0).map((_, i_point) => {
        const index = i_point % nAutoPointStyles;
        return pointStyles[index];
    });
}
