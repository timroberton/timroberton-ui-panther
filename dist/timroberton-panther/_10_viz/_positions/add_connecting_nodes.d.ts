import type { Columns, EdgeCoordMap, NodeCoordMap } from "./types.ts";
import type { Edge, Node } from "./types_incoming.ts";
export declare function addConnectingNodes(nodes: Node[], edges: Edge[], nodeCoordMap: NodeCoordMap, edgeCoordMap: EdgeCoordMap, columns: Columns): void;
