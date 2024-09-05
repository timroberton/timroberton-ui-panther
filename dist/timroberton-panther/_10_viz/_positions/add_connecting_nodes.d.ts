import type { Columns, EdgeCoordMap, NodeCoordMap } from "./types";
import type { Edge, Node } from "./types_incoming";
export declare function addConnectingNodes(nodes: Node[], edges: Edge[], nodeCoordMap: NodeCoordMap, edgeCoordMap: EdgeCoordMap, columns: Columns): void;
