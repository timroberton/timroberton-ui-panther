import { sum } from "./deps.ts";
export function getColWidths(cols, width, _NUMBER_OF_COLUMNS, gapX) {
    const singleColWidth = (width - (_NUMBER_OF_COLUMNS - 1) * gapX) / _NUMBER_OF_COLUMNS;
    if (cols.some((b) => b.span !== undefined &&
        (isNaN(b.span) || b.span < 1 || b.span > _NUMBER_OF_COLUMNS))) {
        throw new Error("Some cols have bad nColSpan");
    }
    const colsSpecified = cols.filter((b) => b.span !== undefined);
    const nSpecified = colsSpecified.length;
    const colsUnspecified = cols.filter((b) => b.span === undefined);
    const nUnspecified = colsUnspecified.length;
    if (nSpecified === 0 && nUnspecified === 0) {
        throw new Error("No cols in row");
    }
    const spanOfSpecified = sum(colsSpecified.map((c) => c.span));
    if (nUnspecified === 0 && spanOfSpecified !== _NUMBER_OF_COLUMNS) {
        throw new Error(`Bad col span specification. Specified spans don't add up to ${_NUMBER_OF_COLUMNS}`);
    }
    const remainingSpan = _NUMBER_OF_COLUMNS - spanOfSpecified;
    const baseSpanOfEachUnspecified = nUnspecified === 0 ? 0 : Math.floor(remainingSpan / nUnspecified);
    if (nUnspecified > 0 && baseSpanOfEachUnspecified <= 0) {
        throw new Error("Bad col span specification. Not enough cols for unspecified");
    }
    const nUnspecifiedReceivingOneExtraCol = remainingSpan - nUnspecified * baseSpanOfEachUnspecified;
    let nReceivedOneExtraCol = 0;
    return cols.map((b) => {
        if (b.span !== undefined) {
            return getBlockWidth(b.span, singleColWidth, gapX);
        }
        nReceivedOneExtraCol += 1;
        const colSpan = baseSpanOfEachUnspecified +
            (nReceivedOneExtraCol <= nUnspecifiedReceivingOneExtraCol ? 1 : 0);
        return getBlockWidth(colSpan, singleColWidth, gapX);
    });
}
function getBlockWidth(nCols, singleColWidth, gapX) {
    return {
        w: singleColWidth * nCols + gapX * (nCols - 1),
        span: nCols,
    };
}
