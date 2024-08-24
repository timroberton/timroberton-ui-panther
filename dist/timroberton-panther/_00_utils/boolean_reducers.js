export function anyTrue(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === true) {
            return true;
        }
    }
    return false;
}
export function allTrue(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === false) {
            return false;
        }
    }
    return true;
}
