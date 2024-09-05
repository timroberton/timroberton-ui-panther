import { type Columns, type EdgeCoordMap, type NodeCoordMap } from "./types";
import type { Edge } from "./types_incoming";
import type { PositionStyle } from "./types_style";
export declare function createBendsMap(edges: Edge[], columns: Columns, nodeCoordMap: NodeCoordMap, edgeCoordMap: EdgeCoordMap, s: PositionStyle): void;
