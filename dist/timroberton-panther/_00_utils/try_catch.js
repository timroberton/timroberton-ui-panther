export function tryCatch(func, msg) {
    try {
        return func();
    }
    catch {
        console.log("%c" + (msg ?? "Did not pass try-catch"), "color: red");
        throw new Error(msg ?? "Did not pass try-catch");
    }
}
