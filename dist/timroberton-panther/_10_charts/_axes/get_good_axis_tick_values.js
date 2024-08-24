import { isUnique } from "../deps.ts";
export function getGoodAxisTickValuesFromMaxValue(maxValue, minValue, startingNTicks, formatter) {
    if (maxValue === 0 && minValue === 0) {
        return getGoodAxisTickValuesFromMaxValue(1, 0, startingNTicks, formatter);
    }
    let nTicks = startingNTicks;
    let arr = getArrayForNTicksAndMaxValue(nTicks, minValue, maxValue);
    while (nTicks > 2 && isNotUnique(arr, formatter)) {
        nTicks -= 1;
        arr = getArrayForNTicksAndMaxValue(nTicks, minValue, maxValue);
    }
    return arr;
}
function getArrayForNTicksAndMaxValue(nTicks, minValue, maxValue) {
    const increment = (maxValue - minValue) / (nTicks - 1);
    const roundedIncrement = getAppropriatelyRoundedIncrement(increment);
    return new Array(nTicks)
        .fill(0)
        .map((_, i) => minValue + i * roundedIncrement)
        .filter((v) => v < maxValue + roundedIncrement);
}
function isNotUnique(arr, formatter) {
    return !isUnique(arr.map((v) => formatter(v)));
}
function getAppropriatelyRoundedIncrement(n) {
    const tens = Math.ceil(Math.log10(n));
    const denom = Math.pow(10, tens);
    const denom5 = denom / 2;
    if (n > denom5) {
        return Math.ceil(n / denom) * denom;
    }
    const denom2 = denom / 5;
    if (n > denom2) {
        return Math.ceil(n / denom5) * denom5;
    }
    return Math.ceil(n / denom2) * denom2;
}
export function getPropotionOfYAxisTakenUpByTicks(yAxisTickLabelDimensions, gridStrokeWidth, chartAreaHeight) {
    const sumYAxisTickLabelHeights = yAxisTickLabelDimensions.reduce((sum, obj, i, arr) => {
        if (i === 0 || i === arr.length - 1) {
            return sum + gridStrokeWidth + (obj.dims.h() - gridStrokeWidth) / 2;
        }
        return sum + obj.dims.h();
    }, 0);
    return sumYAxisTickLabelHeights / chartAreaHeight;
}
