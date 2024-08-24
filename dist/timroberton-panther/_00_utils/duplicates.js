export function getUnique(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
}
export function getDuplicates(arr) {
    return arr
        .filter((v, i, a) => a.indexOf(v) !== i)
        .filter((v, i, a) => a.indexOf(v) === i);
}
export function isUnique(arr) {
    return !arr.some((v, i, a) => a.indexOf(v) !== i);
}
