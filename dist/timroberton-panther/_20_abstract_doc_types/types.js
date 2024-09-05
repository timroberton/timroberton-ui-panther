import { isFigure, isStringArray, } from "./deps";
export function isADTParagraph(item) {
    return (typeof item === "string" ||
        isStringArray(item) ||
        item.p !==
            undefined);
}
export function getADTParagraphAsObjectWithPStringArray(item) {
    if (typeof item === "string") {
        return { p: [item] };
    }
    if (isStringArray(item)) {
        return { p: item };
    }
    if (typeof item.p === "string") {
        return {
            p: [item.p],
            s: item.s,
        };
    }
    return item;
}
export function isADTHeading(item) {
    return (item.h !== undefined ||
        item.h2 !== undefined ||
        item.h3 !== undefined ||
        item.h4 !== undefined);
}
export function getADTHeadingAsGeneric(item) {
    if (item.h !== undefined) {
        return item;
    }
    if (item.h2 !== undefined) {
        return {
            h: item.h2,
            level: 2,
            s: item.s,
        };
    }
    if (item.h3 !== undefined) {
        return {
            h: item.h3,
            level: 3,
            s: item.s,
        };
    }
    if (item.h4 !== undefined) {
        return {
            h: item.h4,
            level: 4,
            s: item.s,
        };
    }
    throw new Error("Bad heading");
}
export function isADTBullets(item) {
    return item.bullets !== undefined;
}
export function getADTBulletAsObject(item) {
    if (typeof item === "string") {
        if (item.length > 4 &&
            item.substring(0, 4) === "    " &&
            item.substring(4, 5) !== " ") {
            return { bullet: item.trim(), level: 3 };
        }
        if (item.length > 2 &&
            item.substring(0, 2) === "  " &&
            item.substring(2, 3) !== " ") {
            return { bullet: item.trim(), level: 2 };
        }
        return { bullet: item.trim(), level: 1 };
    }
    return item;
}
export function isADTQuote(item) {
    return item.quote !== undefined;
}
export function getADTQuoteAsArray(item) {
    if (typeof item.quote === "string") {
        return {
            quote: [item.quote],
            attribution: item.attribution,
            s: item.s,
        };
    }
    return item;
}
export function isADTRawImage(item) {
    return item.imgAbsoluteFilePath !== undefined;
}
export function isADTFigure(item) {
    return isFigure(item);
}
