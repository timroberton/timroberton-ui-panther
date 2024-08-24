export function getFormatterFunc(numberOrPercent, decimalPlaces) {
    switch (decimalPlaces) {
        case 0:
            return numberOrPercent === "number" ? toNum0 : toPct0;
        case 1:
            return numberOrPercent === "number" ? toNum1 : toPct1;
        case 2:
            return numberOrPercent === "number" ? toNum2 : toPct2;
        case 3:
            return numberOrPercent === "number" ? toNum3 : toPct3;
    }
    throw new Error("Could not get formatter func");
}
// Pct
export function toPct0(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return Math.round(num * 100).toFixed(0) + "%";
}
export function toPct1(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 1000) / 10).toFixed(1) + "%";
}
export function toPct2(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 10000) / 100).toFixed(2) + "%";
}
export function toPct3(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 100000) / 1000).toFixed(3) + "%";
}
// Num
export function toNum0(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return Math.round(num)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function toNum1(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 10) / 10)
        .toFixed(1)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function toNum2(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 100) / 100)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function toNum3(v) {
    const num = Number(v);
    if (isNaN(num)) {
        throw new Error("Value is not a number");
    }
    return (Math.round(num * 1000) / 1000)
        .toFixed(3)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
