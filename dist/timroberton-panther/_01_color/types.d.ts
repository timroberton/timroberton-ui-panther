export type KeyColors = {
    base100: string;
    base200: string;
    base300: string;
    baseContent: string;
    baseContentLessVisible: string;
    primary: string;
    primaryContent: string;
};
export type KeyColorsKey = keyof KeyColors;
export type ColorKeyOrString = {
    key: KeyColorsKey;
} | string;
