export async function asyncForEach(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        await func(arr[i], i, arr);
    }
}
export async function asyncMap(arr, func) {
    const output = [];
    for (let i = 0; i < arr.length; i++) {
        output.push(await func(arr[i], i, arr));
    }
    return output;
}
