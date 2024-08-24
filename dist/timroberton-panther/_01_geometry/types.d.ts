type Not<T> = {
    [P in keyof T]?: void;
};
export type CoordsOffset = ({
    left?: number;
    top?: number;
} & Not<{
    right: number;
    bottom: number;
}>) | ({
    left?: number;
    bottom?: number;
} & Not<{
    right: number;
    top: number;
}>) | ({
    right?: number;
    top?: number;
} & Not<{
    left: number;
    bottom: number;
}>) | ({
    right?: number;
    bottom?: number;
} & Not<{
    left: number;
    top: number;
}>);
export {};
