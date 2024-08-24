export function copyHeadersNoneOrArray(headers) {
    if (headers === "none") {
        return "none";
    }
    return [...headers];
}
