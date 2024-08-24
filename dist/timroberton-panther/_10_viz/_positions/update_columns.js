import { getKeyInOutNext } from "./get_keys.ts";
import { getSegmentDirection } from "./get_segment_direction.ts";
import { HorizontalDirection, IncomingOutgoing, SegmentDirection, } from "./types.ts";
import { assert } from "../deps.ts";
export function updateColumnsWithEdgeConnections(columns, edges, nodeCoordMap, edgeCoordMap) {
    columns.forEach((colInfo) => {
        colInfo.numberOfNonConnectingNodes = colInfo.nodeIds.filter((a) => !nodeCoordMap[a].isConnecting).length;
        colInfo.keyIsLeftOtherIsRight = colInfo.nodeIds.reduce((map, nodeId) => {
            map[nodeId] = [];
            return map;
        }, {});
        colInfo.keyIsRightOtherIsLeft = colInfo.nodeIds.reduce((map, nodeId) => {
            map[nodeId] = [];
            return map;
        }, {});
        colInfo.keyIsSameFromOtherIsSameTo = colInfo.nodeIds.reduce((map, nodeId) => {
            map[nodeId] = [];
            return map;
        }, {});
    });
    edges.forEach((edge) => {
        const nodeChain = edgeCoordMap[edge.id].nodeChain;
        const frEnd = edge.fr;
        const toEnd = edge.to;
        for (let i = 0; i < nodeChain.length - 1; i++) {
            // Note: Only go to -1 of length
            const from = nodeChain[i];
            const to = nodeChain[i + 1];
            const fromLayer = nodeCoordMap[from].layer;
            const toLayer = nodeCoordMap[to].layer;
            if (toLayer > fromLayer) {
                columns[fromLayer].keyIsLeftOtherIsRight[from].push({
                    self: from,
                    other: to,
                    frEnd,
                    toEnd,
                    offsetSelf: 0,
                    offsetOther: 0,
                    horizontalDirection: HorizontalDirection.LeftToRight,
                });
                columns[toLayer].keyIsRightOtherIsLeft[to].push({
                    self: to,
                    other: from,
                    frEnd,
                    toEnd,
                    offsetSelf: 0,
                    offsetOther: 0,
                    horizontalDirection: HorizontalDirection.LeftToRight,
                });
            }
            if (fromLayer > toLayer) {
                columns[fromLayer].keyIsRightOtherIsLeft[from].push({
                    self: from,
                    other: to,
                    frEnd,
                    toEnd,
                    offsetSelf: 0,
                    offsetOther: 0,
                    horizontalDirection: HorizontalDirection.RightToLeft,
                });
                columns[toLayer].keyIsLeftOtherIsRight[to].push({
                    self: to,
                    other: from,
                    frEnd,
                    toEnd,
                    offsetSelf: 0,
                    offsetOther: 0,
                    horizontalDirection: HorizontalDirection.RightToLeft,
                });
            }
            if (fromLayer === toLayer) {
                columns[fromLayer].keyIsSameFromOtherIsSameTo[from].push({
                    self: from,
                    other: to,
                    frEnd,
                    toEnd,
                    offsetSelf: 0,
                    offsetOther: 0,
                    horizontalDirection: HorizontalDirection.Same,
                });
            }
        }
    });
    return columns;
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
export function updateColumnsWithYOffsets(columns, nodeCoordMap) {
    columns.forEach((colInfo) => {
        colInfo.nodeIds.forEach((nodeId) => {
            colInfo.keyIsLeftOtherIsRight[nodeId].forEach((c) => {
                c.offsetSelf = getYOffset(c.self, c.horizontalDirection === HorizontalDirection.LeftToRight
                    ? IncomingOutgoing.Outgoing
                    : IncomingOutgoing.Incoming, c.other, nodeCoordMap);
                c.offsetOther = getYOffset(c.other, c.horizontalDirection === HorizontalDirection.LeftToRight
                    ? IncomingOutgoing.Incoming
                    : IncomingOutgoing.Outgoing, c.self, nodeCoordMap);
            });
            colInfo.keyIsRightOtherIsLeft[nodeId].forEach((c) => {
                c.offsetSelf = getYOffset(c.self, c.horizontalDirection === HorizontalDirection.LeftToRight
                    ? IncomingOutgoing.Incoming
                    : IncomingOutgoing.Outgoing, c.other, nodeCoordMap);
                c.offsetOther = getYOffset(c.other, c.horizontalDirection === HorizontalDirection.LeftToRight
                    ? IncomingOutgoing.Outgoing
                    : IncomingOutgoing.Incoming, c.self, nodeCoordMap);
            });
            colInfo.keyIsSameFromOtherIsSameTo[nodeId].forEach((c) => {
                c.offsetSelf = getYOffset(c.self, IncomingOutgoing.Outgoing, c.other, nodeCoordMap);
                c.offsetOther = getYOffset(c.other, IncomingOutgoing.Incoming, c.self, nodeCoordMap);
            });
        });
    });
}
function getYOffset(nodeForWhichTheOffsetIsNeeded, incomingOutgoing, otherNext, nodeCoordMap) {
    const nc = nodeCoordMap[nodeForWhichTheOffsetIsNeeded];
    if (nc.isConnecting) {
        return 0;
    }
    return nc.yOffsetsUsingInOutKey[getKeyInOutNext(incomingOutgoing, otherNext)];
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
export function updateColumnsWithSegmentsNormalAndAround(columns, nodeCoordMap) {
    columns.forEach((colInfo) => {
        colInfo.nodeIds.forEach((nodeId) => {
            // NORMAL
            colInfo.keyIsLeftOtherIsRight[nodeId].forEach((connection) => {
                const yLeft = nodeCoordMap[connection.self].y + connection.offsetSelf;
                const yRight = nodeCoordMap[connection.other].y + connection.offsetOther;
                const leftToRightGoesUp = yRight < yLeft;
                const leftToRightGoesDown = !leftToRightGoesUp && yLeft < yRight;
                const leftToRightGoesStraight = !leftToRightGoesUp && !leftToRightGoesDown;
                const yTop = leftToRightGoesDown ? yLeft : yRight;
                const yBottom = leftToRightGoesDown ? yRight : yLeft;
                colInfo.segmentsNormalToTheRight.push({
                    left: connection.self,
                    right: connection.other,
                    frEnd: connection.frEnd,
                    toEnd: connection.toEnd,
                    horizontalDirection: connection.horizontalDirection,
                    yLeft,
                    yRight,
                    yTop,
                    yBottom,
                    totalHeight: yBottom - yTop,
                    leftToRightGoesUp,
                    leftToRightGoesDown,
                    leftToRightGoesStraight,
                    track: -1,
                });
            });
            // AROUND
            colInfo.keyIsSameFromOtherIsSameTo[nodeId].forEach((connection) => {
                const segmentDirection = getSegmentDirection(connection.self, connection.other, nodeCoordMap);
                if (segmentDirection === SegmentDirection.ImmediateUp ||
                    segmentDirection === SegmentDirection.ImmediateDown) {
                    colInfo.segmentsImmediate.push({
                        fr: connection.self,
                        to: connection.other,
                        goesUp: nodeCoordMap[connection.self].sequence >
                            nodeCoordMap[connection.other].sequence,
                        goesDown: nodeCoordMap[connection.self].sequence <
                            nodeCoordMap[connection.other].sequence,
                    });
                    return;
                }
                const yFrom = nodeCoordMap[connection.self].y + connection.offsetSelf;
                const yTo = nodeCoordMap[connection.other].y + connection.offsetOther;
                const fromToGoesUp = yTo < yFrom;
                const fromToGoesDown = yFrom < yTo;
                const yTop = fromToGoesDown ? yFrom : yTo;
                const yBottom = fromToGoesDown ? yTo : yFrom;
                assert(yTop <= yBottom);
                colInfo.segmentsAroundToTheLeft.push({
                    from: connection.self,
                    to: connection.other,
                    yFrom,
                    yTo,
                    yTop,
                    yBottom,
                    totalHeight: yBottom - yTop,
                    fromToGoesUp,
                    fromToGoesDown,
                    track: -1,
                });
            });
        });
    });
}
export function sortAndCollapseSegmentTracks(columns, s) {
    const bGetsTrackToTheLeft = -1;
    const cGetsTrackToTheLeft = 1;
    columns.forEach((colInfo) => {
        // NORMAL
        // Sort so that tracks to the left come first
        colInfo.segmentsNormalToTheRight.sort((b, c) => {
            // First address special case of same start and end node, i.e. parallel edges, one going each way
            if (b.left === c.left && b.right === c.right) {
                return b.horizontalDirection === HorizontalDirection.RightToLeft
                    ? b.leftToRightGoesUp
                        ? cGetsTrackToTheLeft
                        : bGetsTrackToTheLeft
                    : b.leftToRightGoesUp
                        ? bGetsTrackToTheLeft
                        : cGetsTrackToTheLeft;
            }
            if (b.leftToRightGoesDown && c.leftToRightGoesDown) {
                // If both go down, lowest (bottomest) yLeft gets track to the left
                return c.yLeft - b.yLeft;
            }
            if (b.leftToRightGoesUp && c.leftToRightGoesUp) {
                // If both go up, highest (toppest) yLeft gets track to the left
                return b.yLeft - c.yLeft;
            }
            // The following is arbitrary, but we need some system so all pairwise tracks get sorted (i.e. if we just return 0 here, it doesn't work)
            if (b.leftToRightGoesDown) {
                return bGetsTrackToTheLeft;
            }
            return cGetsTrackToTheLeft;
        });
        // AROUND
        // Sort so that tracks to the left come first
        colInfo.segmentsAroundToTheLeft.sort((b, c) => {
            // Longest height gets track to the left;
            return c.totalHeight - b.totalHeight;
        });
        // Collapse
        const _PREVENT_COLLAPSE = false; // <----------------------------------------------------------- Remove this after testing
        collapseNormal(colInfo.segmentsNormalToTheRight, s, _PREVENT_COLLAPSE);
        collapseAround(colInfo.segmentsAroundToTheLeft, s, _PREVENT_COLLAPSE);
    });
}
function collapseNormal(segs, s, _PREVENT_COLLAPSE) {
    const tracks = new Array(segs.length)
        .fill(0)
        .map(() => []);
    segs.forEach((seg, segIndex) => {
        if (seg.leftToRightGoesStraight) {
            seg.track = 0;
            return;
        }
        const firstTrackToTry = segIndex - 1;
        for (let i = firstTrackToTry; i >= 0; i--) {
            // Note: i is decremented, and will skip if i < 0 (i.e. will skip first seg)
            if (_PREVENT_COLLAPSE || cannotFitNormal(seg, tracks[i], s)) {
                seg.track = i + 1;
                tracks[i + 1].push(seg);
                return;
            }
        }
        seg.track = 0;
        tracks[0].push(seg);
    });
}
function cannotFitNormal(seg, segs, s) {
    if (seg.leftToRightGoesDown) {
        for (let i = 0; i < segs.length; i++) {
            const clearsAbove = seg.yBottom < segs[i].yTop - s.COLLAPSE_BUFFER;
            const clearsBelow = seg.yTop > segs[i].yBottom;
            if (!clearsAbove && !clearsBelow) {
                return true;
            }
        }
    }
    else {
        for (let i = 0; i < segs.length; i++) {
            const clearsAbove = seg.yBottom < segs[i].yTop;
            const clearsBelow = seg.yTop > segs[i].yBottom + s.COLLAPSE_BUFFER;
            if (!clearsAbove && !clearsBelow) {
                return true;
            }
        }
    }
    return false;
}
function collapseAround(segs, s, _PREVENT_COLLAPSE) {
    const tracks = new Array(segs.length)
        .fill(0)
        .map(() => []);
    segs.forEach((seg, segIndex) => {
        const firstTrackToTry = segIndex - 1;
        for (let i = firstTrackToTry; i >= 0; i--) {
            // Note: i is decremented, and will skip if i < 0 (i.e. will skip first seg)
            if (_PREVENT_COLLAPSE || cannotFitAround(seg, tracks[i], s)) {
                seg.track = i + 1;
                tracks[i + 1].push(seg);
                return;
            }
        }
        seg.track = 0;
        tracks[0].push(seg);
    });
}
function cannotFitAround(seg, segs, s) {
    if (seg.fromToGoesDown) {
        for (let i = 0; i < segs.length; i++) {
            const clearsAbove = seg.yBottom < segs[i].yTop - s.COLLAPSE_BUFFER;
            const clearsBelow = seg.yTop > segs[i].yBottom;
            if (!clearsAbove && !clearsBelow) {
                return true;
            }
        }
    }
    else {
        for (let i = 0; i < segs.length; i++) {
            const clearsAbove = seg.yBottom < segs[i].yTop;
            const clearsBelow = seg.yTop > segs[i].yBottom + s.COLLAPSE_BUFFER;
            if (!clearsAbove && !clearsBelow) {
                return true;
            }
        }
    }
    return false;
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
export function updateColumnsWithBreakInfo(columns, tiles, tileCoordMap) {
    columns.forEach((colInfo, i) => {
        colInfo.numberTracksNormalL =
            i === 0 ? 0 : numberOfTracksNormalToTheRight(columns, i - 1);
        colInfo.numberTracksNormalR = numberOfTracksNormalToTheRight(columns, i);
        colInfo.hasTracksNormalL = colInfo.numberTracksNormalL > 0;
        colInfo.hasTracksNormalR = colInfo.numberTracksNormalR > 0;
        //
        colInfo.numberTracksAroundL = numberOfTracksAroundToTheLeft(columns, i);
        colInfo.numberTracksAroundR =
            i >= columns.length - 1
                ? 0
                : numberOfTracksAroundToTheLeft(columns, i + 1);
        colInfo.hasTracksAroundL = colInfo.numberTracksAroundL > 0;
        colInfo.hasTracksAroundR = colInfo.numberTracksAroundR > 0;
        //
        const { hasTileBreakL, hasTileBreakR } = getTileBreaks(i, tiles, tileCoordMap);
        colInfo.tileBreakL = hasTileBreakL;
        colInfo.tileBreakR = hasTileBreakR;
    });
}
function numberOfTracksNormalToTheRight(columns, iLayer) {
    const trackNumbers = columns[iLayer].segmentsNormalToTheRight
        .filter((seg) => seg.leftToRightGoesUp || seg.leftToRightGoesDown)
        .map((seg) => seg.track);
    return Math.max(-1, ...trackNumbers) + 1;
}
function numberOfTracksAroundToTheLeft(columns, iLayer) {
    const trackNumbers = columns[iLayer].segmentsAroundToTheLeft.map((seg) => seg.track);
    return Math.max(-1, ...trackNumbers) + 1;
}
function getTileBreaks(layerIndex, tiles, tileCoordMap) {
    return {
        hasTileBreakL: layerIndex === 0
            ? true
            : tiles.some((t) => tileCoordMap[t.id].finalFromLayer === layerIndex),
        hasTileBreakR: tiles.some((t) => tileCoordMap[t.id].finalToLayer === layerIndex),
    };
}
