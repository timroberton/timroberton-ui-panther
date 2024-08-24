export function withAnyLabelReplacement(strOrArr, labelReplacements) {
    if (typeof strOrArr === "string") {
        if (labelReplacements && labelReplacements[strOrArr]) {
            return labelReplacements[strOrArr];
        }
        return strOrArr;
    }
    return strOrArr.map((str) => {
        if (labelReplacements && labelReplacements[str]) {
            return labelReplacements[str];
        }
        return str;
    });
}
