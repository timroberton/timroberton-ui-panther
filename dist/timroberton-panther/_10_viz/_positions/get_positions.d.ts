import type { Columns, EdgeCoordMap, ModelBounds, NodeCoordMap, TileCoordMap } from "./types";
import type { CustomPositionStyle, TimVizData } from "./types_incoming";
export declare function getPositionsSimple(m: TimVizData, customStyleProps?: CustomPositionStyle): {
    nodeCoordMap: NodeCoordMap;
    edgeCoordMap: EdgeCoordMap;
    tileCoordMap: TileCoordMap;
    columns: Columns;
    bounds: ModelBounds;
};
