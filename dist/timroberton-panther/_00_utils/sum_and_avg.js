export function sum(arr) {
    return arr.reduce((s, v) => s + v, 0);
}
export function sumWith(arr, func) {
    return arr.reduce((prev, v) => prev + func(v), 0);
}
export function avg(arr) {
    if (arr.length === 0) {
        return 0;
    }
    return arr.reduce((s, v) => s + v, 0) / arr.length;
}
export function sumStringsIntoString(arr, toFixedDigits) {
    const summed = arr.reduce((s, v) => {
        const num = Number(v);
        if (isNaN(num)) {
            console.log(arr);
            throw new Error("Cannot read cell as number. Cell is NaN.");
        }
        return s + num;
    }, 0);
    if (toFixedDigits === undefined) {
        return String(summed);
    }
    return summed.toFixed(toFixedDigits);
}
export function avgStringsIntoString(arr, toFixedDigits) {
    const avged = arr.length === 0
        ? 0
        : arr.reduce((s, v) => {
            const num = Number(v);
            if (isNaN(num)) {
                console.log(arr);
                throw new Error("Cannot read cell as number. Cell is NaN.");
            }
            return s + num;
        }, 0) / arr.length;
    if (toFixedDigits === undefined) {
        return String(avged);
    }
    return avged.toFixed(toFixedDigits);
}
