import { type Columns, type EdgeCoordMap, type NodeCoordMap, type TileCoordMap } from "./types.ts";
import type { Edge, Tile } from "./types_incoming.ts";
import type { PositionStyle } from "./types_style.ts";
export declare function updateColumnsWithEdgeConnections(columns: Columns, edges: Edge[], nodeCoordMap: NodeCoordMap, edgeCoordMap: EdgeCoordMap): Columns;
export declare function updateColumnsWithYOffsets(columns: Columns, nodeCoordMap: NodeCoordMap): void;
export declare function updateColumnsWithSegmentsNormalAndAround(columns: Columns, nodeCoordMap: NodeCoordMap): void;
export declare function sortAndCollapseSegmentTracks(columns: Columns, s: PositionStyle): void;
export declare function updateColumnsWithBreakInfo(columns: Columns, tiles: Tile[], tileCoordMap: TileCoordMap): void;