export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function getStringOrThrow(str) {
    if (str === undefined) {
        throw new Error("String is undefined");
    }
    if (typeof str !== "string") {
        throw new Error("String is not string");
    }
    return str;
}
export function getNonEmptyStringOrThrow(str) {
    if (str === undefined) {
        throw new Error("String is undefined");
    }
    if (typeof str !== "string") {
        throw new Error("String is not string");
    }
    if (str.trim() === "") {
        throw new Error("String is empty");
    }
    return str;
}
export function getCleanString(str) {
    return str.replace(/\s\s+/gm, " ").trim();
}
export function getCleanStringOnOneLine(str) {
    return str
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/\s\s+/g, " ")
        .trim();
}
