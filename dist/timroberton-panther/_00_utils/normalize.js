import { sum } from "./sum_and_avg";
export function normalizeToTotalOf1(arr) {
    const total = sum(arr);
    if (total === 0) {
        throw new Error("Cannot normalize when total is zero");
    }
    return arr.map((val) => val / total);
}
export function normalizeToTotalOf1OrZeroIfSumToZero(arr) {
    const total = sum(arr);
    if (total === 0) {
        return arr.map(() => 0);
    }
    return arr.map((val) => val / total);
}
