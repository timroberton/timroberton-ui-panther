export function getSortedAlphabetical(arr) {
    const newArr = [...arr];
    sortAlphabetical(newArr);
    return newArr;
}
export function sortAlphabetical(arr) {
    arr.sort(sortFuncAlphabetical);
}
export function sortFuncAlphabetical(a, b) {
    const a1 = a.toLowerCase().trim();
    const b1 = b.toLowerCase().trim();
    if (a1 < b1) {
        return -1;
    }
    if (a1 > b1) {
        return 1;
    }
    return 0;
}
