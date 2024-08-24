import { type Columns, type EdgeCoordMap, type NodeCoordMap } from "./types.ts";
import type { Edge } from "./types_incoming.ts";
import type { PositionStyle } from "./types_style.ts";
export declare function createBendsMap(edges: Edge[], columns: Columns, nodeCoordMap: NodeCoordMap, edgeCoordMap: EdgeCoordMap, s: PositionStyle): void;
