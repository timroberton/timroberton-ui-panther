export function isStringArray(arr) {
    if (arr instanceof Array) {
        for (const item of arr) {
            if (typeof item !== "string") {
                return false;
            }
        }
        return true;
    }
    return false;
}
