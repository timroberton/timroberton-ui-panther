import type { Columns, TileCoordMap } from "./types.ts";
import type { Node, Tile } from "./types_incoming.ts";
import type { PositionStyle } from "./types_style.ts";
export declare function createColumnsAndUpdateTileCoordMap(tiles: Tile[], nodes: Node[], tileCoordMap: TileCoordMap, s: PositionStyle): Columns;
