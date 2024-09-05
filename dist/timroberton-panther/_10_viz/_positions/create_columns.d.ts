import type { Columns, TileCoordMap } from "./types";
import type { Node, Tile } from "./types_incoming";
import type { PositionStyle } from "./types_style";
export declare function createColumnsAndUpdateTileCoordMap(tiles: Tile[], nodes: Node[], tileCoordMap: TileCoordMap, s: PositionStyle): Columns;
