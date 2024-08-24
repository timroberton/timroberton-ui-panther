import { addConnectingNodes } from "./add_connecting_nodes.ts";
import { addPathData } from "./add_path_data.ts";
import { createBendsMap } from "./create_bends_map.ts";
import { createColumnsAndUpdateTileCoordMap } from "./create_columns.ts";
import { addAndSortNodeJoins, createEdgeCoordMap, createNodeCoordMap, createTileCoordMap, updateNodeCoordMapWithTrackMaps, updateNodeCoordMapWithYOffsets, } from "./create_node_coord_map.ts";
import { _DEFAULT_POSITIONSTYLE } from "./default_style.ts";
import { getModelBounds } from "./get_model_bounds.ts";
import { sortSequencing } from "./sort_sequencing.ts";
import { sortAndCollapseSegmentTracks, updateColumnsWithBreakInfo, updateColumnsWithEdgeConnections, updateColumnsWithSegmentsNormalAndAround, updateColumnsWithYOffsets, } from "./update_columns.ts";
import { updateHorizontalPositions } from "./update_horizontal_positions.ts";
import { updateTileCoords } from "./update_tile_coords.ts";
import { updateVerticalPositions } from "./update_vertical_positions.ts";
export function getPositionsSimple(m, customStyleProps) {
    const s = {
        ..._DEFAULT_POSITIONSTYLE,
        ...customStyleProps,
    };
    const nodeCoordMap = createNodeCoordMap(m.nodes);
    const edgeCoordMap = createEdgeCoordMap(m.edges);
    const tileCoordMap = createTileCoordMap(m.tiles);
    const columns = createColumnsAndUpdateTileCoordMap(m.tiles, m.nodes, tileCoordMap, s);
    addConnectingNodes(m.nodes, m.edges, nodeCoordMap, edgeCoordMap, columns);
    updateColumnsWithEdgeConnections(columns, m.edges, nodeCoordMap, edgeCoordMap);
    // Sequencing
    sortSequencing(m.nodes, columns, nodeCoordMap, s);
    // This adds and sorts the joins
    addAndSortNodeJoins(m.nodes, m.edges, nodeCoordMap, edgeCoordMap);
    // This adds yOffsets, based on join order
    updateNodeCoordMapWithYOffsets(m.nodes, nodeCoordMap, s);
    // Update columns with RECURSIVE yOffsets
    updateColumnsWithYOffsets(columns, nodeCoordMap);
    // Vertical spacing
    updateVerticalPositions(columns, nodeCoordMap, s);
    // Update columns SEGMENTS and BREAKS
    updateColumnsWithSegmentsNormalAndAround(columns, nodeCoordMap);
    sortAndCollapseSegmentTracks(columns, s);
    updateColumnsWithBreakInfo(columns, m.tiles, tileCoordMap);
    updateNodeCoordMapWithTrackMaps(columns, m.nodes, nodeCoordMap, s);
    // Horizontal spacing
    updateHorizontalPositions(columns, m.nodes, nodeCoordMap, s);
    updateTileCoords(m.tiles, tileCoordMap, columns);
    // Edges
    createBendsMap(m.edges, columns, nodeCoordMap, edgeCoordMap, s);
    addPathData(m.edges, edgeCoordMap, s);
    // Bounds
    const bounds = getModelBounds(columns);
    return { nodeCoordMap, edgeCoordMap, tileCoordMap, columns, bounds };
}
