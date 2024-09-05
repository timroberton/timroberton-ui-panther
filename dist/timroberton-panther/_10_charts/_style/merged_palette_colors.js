import { Color, getColor, } from "../deps";
export function getMergedPaletteColorsColRow(data, cs) {
    const s = cs.getMergedPaletteColorsStyle();
    if (s.logic === "single") {
        return {
            paletteType: "single",
            color: getColor(s.single),
        };
    }
    if (s.logic === "specific-by-row") {
        if (s.specific.length !== data.rowHeaders.length) {
            console.log(s.specific, data.rowHeaders);
            throw new Error("Specific palette does not match rowHeaders");
        }
        return {
            paletteType: "by-row",
            colors: s.specific.map(getColor),
        };
    }
    if (s.logic === "specific-by-col") {
        if (s.specific.length !== data.colHeaders.length) {
            console.log(s.specific, data.colHeaders);
            throw new Error("Specific palette does not match colHeaders");
        }
        return {
            paletteType: "by-col",
            colors: s.specific.map(getColor),
        };
    }
    if (s.logic === "auto-by-row") {
        return {
            paletteType: "by-row",
            colors: Color.scale(getColor(s.auto.first), getColor(s.auto.last), data.rowHeaders.length),
        };
    }
    if (s.logic === "auto-by-col") {
        return {
            paletteType: "by-col",
            colors: Color.scale(getColor(s.auto.first), getColor(s.auto.last), data.colHeaders.length),
        };
    }
    if (s.logic === "func") {
        return {
            paletteType: "func",
            func: (i_row, i_col, i_colGroup, i_colInColGroup) => getColor(s.func(i_row, i_col, i_colGroup, i_colInColGroup)),
        };
    }
    throw new Error("Should not be possible");
}
export function getMergedPaletteColorsXY(data, cs) {
    const s = cs.getMergedPaletteColorsStyle();
    const maxSeriesLength = Math.max(...data.series.map((ser) => ser.values.length));
    if (s.logic === "single") {
        return {
            paletteType: "single",
            color: getColor(s.single),
        };
    }
    if (s.logic === "specific-by-row") {
        if (s.specific.length !== data.series.length) {
            console.log(s.specific, data.series);
            throw new Error("Specific palette does not match rowHeaders");
        }
        return {
            paletteType: "by-row",
            colors: s.specific.map(getColor),
        };
    }
    if (s.logic === "specific-by-col") {
        if (s.specific.length !== maxSeriesLength) {
            console.log(s.specific, data.series);
            throw new Error("Specific palette does not match colHeaders");
        }
        return {
            paletteType: "by-col",
            colors: s.specific.map(getColor),
        };
    }
    if (s.logic === "auto-by-row") {
        return {
            paletteType: "by-row",
            colors: Color.scale(getColor(s.auto.first), getColor(s.auto.last), data.series.length),
        };
    }
    if (s.logic === "auto-by-col") {
        return {
            paletteType: "by-col",
            colors: Color.scale(getColor(s.auto.first), getColor(s.auto.last), maxSeriesLength),
        };
    }
    throw new Error("Should not be possible");
}
export function getMergedPaletteColorsSankey(data, cs) {
    const s = cs.getMergedPaletteColorsStyle();
    return {
        paletteType: "single",
        color: getColor(s.single),
    };
}
