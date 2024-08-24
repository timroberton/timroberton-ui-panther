export function assert(test, msg) {
    if (!test) {
        console.log("%c" + (msg ?? "Did not pass assertion test"), "color: red");
        throw new Error(msg ?? "Did not pass assertion test");
    }
}
export function assertArray(a, msg) {
    if (!(a instanceof Array)) {
        console.log("%c" + (msg ?? "Not an instance of an array"), "color: red");
        throw new Error(msg ?? "Not an instance of an array");
    }
}
export function assertNumberBetween0And1(a, msg) {
    if (typeof a !== "number" || isNaN(a) || a < 0 || a > 1) {
        console.log("%c" + (msg ?? "Not an number between 0 and 1"), "color: red");
        throw new Error(msg ?? "Not an number between 0 and 1");
    }
}
export function assertNotUndefined(a, msg) {
    if (a === undefined) {
        console.log("%c" + (msg ?? "Item is undefined"), "color: red");
        throw new Error(msg ?? "Item is undefined");
    }
    if (a === null) {
        console.log("%c" + (msg ?? "Item is null"), "color: red");
        throw new Error(msg ?? "Item is null");
    }
}
export function assertTwoArraysAreSameAndInSameOrder(a, b, msg) {
    if (a.length !== b.length) {
        console.log("%c" + (msg ?? "Arrays are not the same length"), "color: red");
        throw new Error(msg ?? "Arrays are not the same length");
    }
    a.forEach((aItem, i_aItem) => {
        if (b[i_aItem] !== aItem) {
            console.log("%c" + (msg ?? "Arrays not the same"), "color: red");
            throw new Error(msg ?? "Arrays not the same");
        }
    });
}
export function assertUnique(arr, msg) {
    if (arr.length === 0) {
        return;
    }
    if (typeof arr[0] === "number") {
        for (let i = 0; i < arr.length; i++) {
            if (arr.indexOf(arr[i]) !== i) {
                throw new Error(msg ?? "Array is not unique");
            }
        }
        return;
    }
    if (typeof arr[0] === "string") {
        for (let i = 0; i < arr.length; i++) {
            if (arr.indexOf(arr[i]) !== i) {
                throw new Error(msg ?? "Array is not unique");
            }
        }
        return;
    }
    throw new Error("Must be string array or number array");
}
