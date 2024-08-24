export function createArray(n, valOrValFunc) {
    if (valOrValFunc === undefined) {
        return new Array(n).fill(0).map((_, i) => i);
    }
    if (typeof valOrValFunc === "function") {
        return new Array(n).fill(0).map((_, i) => valOrValFunc(i));
    }
    if (typeof valOrValFunc === "object") {
        return new Array(n).fill(0).map(() => structuredClone(valOrValFunc));
    }
    if (typeof valOrValFunc === "string") {
        return new Array(n).fill(0).map(() => valOrValFunc);
    }
    if (typeof valOrValFunc === "number") {
        return new Array(n).fill(0).map(() => valOrValFunc);
    }
    throw new Error("Should not happen");
}
