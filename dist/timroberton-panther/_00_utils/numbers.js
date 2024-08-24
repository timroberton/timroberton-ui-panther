export function round(val, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(val * multiplier) / multiplier;
}
export function getValidNumberOrThrowError(val) {
    if (val === undefined) {
        throw new Error("Cannot read cell as number. Cell is undefined.");
    }
    if (typeof val === "string" && val.trim() === "") {
        throw new Error("Cannot read cell as number. Cell is an empty string.");
    }
    const num = Number(val);
    if (isNaN(num)) {
        throw new Error("Cannot read cell as number. Cell is NaN. " + val);
    }
    return num;
}
export function getValidNumberOrZero(val) {
    if (typeof val === "string" && val.trim() === "") {
        return 0;
    }
    const num = Number(val);
    if (isNaN(num)) {
        throw new Error("Cannot read cell as number. Cell is NaN. " + val);
    }
    return num;
}
export function divideOrZero(numerator, denominator) {
    if (denominator === 0) {
        return 0;
    }
    const val = numerator / denominator;
    if (isNaN(val)) {
        throw new Error("Value is NaN");
    }
    return val;
}
