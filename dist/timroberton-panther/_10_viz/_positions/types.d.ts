export type Columns = ColumnInfo[];
export type ColumnInfo = {
    nodeIds: string[];
    numberOfNonConnectingNodes: number;
    keyIsLeftOtherIsRight: FromToMapper;
    keyIsRightOtherIsLeft: FromToMapper;
    keyIsSameFromOtherIsSameTo: FromToMapper;
    segmentsNormalToTheRight: SegmentNormal[];
    segmentsAroundToTheLeft: SegmentAround[];
    segmentsImmediate: SegmentImmediate[];
    hasTracksNormalL: boolean;
    hasTracksNormalR: boolean;
    numberTracksNormalL: number;
    numberTracksNormalR: number;
    hasTracksAroundL: boolean;
    hasTracksAroundR: boolean;
    numberTracksAroundL: number;
    numberTracksAroundR: number;
    tileBreakL: boolean;
    tileBreakR: boolean;
    maxNodeWidth: number;
    xl: number;
    xc: number;
    xr: number;
    yt: number;
    yb: number;
    nodeL: number;
    nodeR: number;
    edgeVL: number;
    edgeVR: number;
};
export type Segment = SegmentNormal | SegmentAround | SegmentImmediate;
export type SegmentNormal = {
    left: string;
    right: string;
    frEnd: string;
    toEnd: string;
    horizontalDirection: HorizontalDirection;
    yLeft: number;
    yRight: number;
    yTop: number;
    yBottom: number;
    totalHeight: number;
    leftToRightGoesUp: boolean;
    leftToRightGoesDown: boolean;
    leftToRightGoesStraight: boolean;
    track: number;
};
export type SegmentAround = {
    from: string;
    to: string;
    yFrom: number;
    yTo: number;
    yTop: number;
    yBottom: number;
    totalHeight: number;
    fromToGoesUp: boolean;
    fromToGoesDown: boolean;
    track: number;
};
export type SegmentImmediate = {
    fr: string;
    to: string;
    goesUp: boolean;
    goesDown: boolean;
};
export type FromToMapper = {
    [key: string]: FromToConnection[];
};
export type FromToConnection = {
    self: string;
    other: string;
    frEnd: string;
    toEnd: string;
    offsetSelf: number;
    offsetOther: number;
    horizontalDirection: HorizontalDirection;
};
export type NodeCoordMap = {
    [key: string]: NodeCoords;
};
export type NodeCoords = {
    w: number;
    h: number;
    isConnecting: boolean;
    endFrIfConnecting: string;
    endToIfConnecting: string;
    layer: number;
    sequence: number;
    sequenceIgnoringConnectingNodes: number;
    y: number;
    x: number;
    colXL: number;
    colXR: number;
    colVL: number;
    trackMapXR_forLeftNodes: {
        [key: string]: number;
    };
    trackMapVL_forFromNodes: {
        [key: string]: number;
    };
    immediateOffsetMapIncoming: {
        [key: string]: number;
    };
    immediateOffsetMapOutgoing: {
        [key: string]: number;
    };
    joinsL: Join[];
    joinsR: Join[];
    joinsT: {
        other: string;
        incomingOutgoing: IncomingOutgoing;
    }[];
    joinsB: {
        other: string;
        incomingOutgoing: IncomingOutgoing;
    }[];
    yOffsetsUsingInOutKey: {
        [key: string]: number;
    };
};
export type Join = {
    nextNodeChainIdForSorting: string;
    incomingOutgoing: IncomingOutgoing;
    finalOrder: number;
};
export type EdgeCoordMap = {
    [key: string]: EdgeCoords;
};
export type EdgeCoords = {
    id: string;
    fr: string;
    to: string;
    nodeChain: string[];
    edgeSegments: EdgeSegment[];
    pathData: PathDataSegment[];
};
export type PathDataSegment = {
    segType: "moveTo";
    x: number;
    y: number;
} | {
    segType: "lineTo";
    x: number;
    y: number;
} | {
    segType: "curveTo";
    toX: number;
    toY: number;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
};
export type EdgeSegment = {
    fr: string;
    to: string;
    segmentDirection: SegmentDirection;
    frX: number;
    frY: number;
    toX: number;
    toY: number;
    trackX: number;
    trackBayStart: number;
    trackBayEnd: number;
    isFirstSegment: boolean;
    isLastSegment: boolean;
};
export type TileCoordMap = {
    [key: string]: TileCoords;
};
export type TileCoords = {
    finalFromLayer: number;
    finalToLayer: number;
    joinL: boolean;
    joinR: boolean;
    xl: number;
    xr: number;
    yt: number;
    yb: number;
};
export declare enum IncomingOutgoing {
    Incoming = "Incoming",
    Outgoing = "Outgoing"
}
export declare enum HorizontalDirection {
    LeftToRight = "LeftToRight",
    RightToLeft = "RightToLeft",
    Same = "Same"
}
export declare enum SegmentDirection {
    LeftToRight = "LeftToRight",
    RightToLeft = "RightToLeft",
    VerticalAroundUp = "VerticalAroundUp",
    VerticalAroundDown = "VerticalAroundDown",
    ImmediateUp = "ImmediateUp",
    ImmediateDown = "ImmediateDown"
}
export type ModelBounds = {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
};
