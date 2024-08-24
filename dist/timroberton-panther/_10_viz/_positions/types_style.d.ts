export interface PositionStyle {
    VERTICAL_SPACING: VERTICAL_SPACING;
    SHOW_TILES: boolean;
    TILE_HORIZONTAL_GAP: number;
    NODE_VERTICAL_GAP: number;
    EDGE_TO_EDGE_VERTICAL_GAP: number;
    EDGE_TO_EDGE_HORIZONTAL_GAP: number;
    JOIN_MARGIN: number;
    COLLAPSE_BUFFER: number;
    EDGE_FORMAT: EDGE_FORMAT;
    EDGE_SMOOTHING: number;
    TILE_VERTICAL_PADDING: number;
    TILE_HORIZONTAL_PADDING: number;
    strokeWidthForArrowCrop: number;
}
export type VERTICAL_SPACING = "automatic" | "centered" | "top";
export type EDGE_FORMAT = "classic" | "straight";
