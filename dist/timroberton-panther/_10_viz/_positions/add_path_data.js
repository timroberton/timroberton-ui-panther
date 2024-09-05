import { SegmentDirection, } from "./types";
export function addPathData(edges, edgeCoordMap, s) {
    edges.forEach((edge) => {
        const ew = s.strokeWidthForArrowCrop;
        const sm = s.EDGE_SMOOTHING;
        const ec = edgeCoordMap[edge.id];
        switch (s.EDGE_FORMAT) {
            case "classic":
                addPathDataStraight(ec.pathData, ec.edgeSegments, ew, sm);
                return;
            case "straight":
                addPathDataStraight(ec.pathData, ec.edgeSegments, ew, sm);
                return;
        }
    });
}
function addPathDataStraight(pathData, edgeSegments, ew, smoothing) {
    let startX = edgeSegments[0].frX;
    let startY = edgeSegments[0].frY;
    pathData.push({
        segType: "moveTo",
        x: startX,
        y: startY,
    });
    // let d = `M ${startX} ${startY}`;
    // const nFillers = 16 - edgeSegments.length;
    // for (let i = 0; i < nFillers; i++) {
    //   d += ` C ${startX},${startY} ${startX},${startY} ${startX},${startY} L ${startX},${startY} C ${startX},${startY} ${startX},${startY} ${startX},${startY}`;
    // }
    const _MAX_DELTA_LENGTH = smoothing;
    const _MIN_ANGLE_DISPLACEMENT_THRESHOLD = 8;
    return edgeSegments.forEach((sg) => {
        if (sg.isLastSegment) {
            cropLastBendForArrow(sg, ew);
        }
        const deltaLength = Math.min(Math.abs(sg.toY - sg.frY) / 2, _MAX_DELTA_LENGTH);
        const d = deltaLength * Math.sign(sg.toY - sg.frY); // positive is for "going down";
        // Angle displacement (left and right)
        let ADL = 0;
        let ADR = 0;
        const useAngleDisplacement = deltaLength < _MIN_ANGLE_DISPLACEMENT_THRESHOLD;
        if (useAngleDisplacement) {
            const xdL = sg.trackX - sg.frX;
            const xdR = sg.toX - sg.trackX;
            const halfMinXD = Math.min(Math.abs(xdL), Math.abs(xdR)) / 2;
            const AD = halfMinXD * (1 - deltaLength / _MIN_ANGLE_DISPLACEMENT_THRESHOLD);
            ADL = AD * Math.sign(xdL);
            ADR = AD * Math.sign(xdR);
        }
        if (sg.segmentDirection === SegmentDirection.LeftToRight ||
            sg.segmentDirection === SegmentDirection.RightToLeft ||
            sg.segmentDirection === SegmentDirection.VerticalAroundDown ||
            sg.segmentDirection === SegmentDirection.VerticalAroundUp) {
            pathData.push({
                segType: "curveTo",
                cp1x: sg.trackX - ADL,
                cp1y: sg.frY,
                cp2x: sg.trackX - ADL,
                cp2y: sg.frY,
                toX: sg.trackX,
                toY: sg.frY + d,
            });
            pathData.push({
                segType: "lineTo",
                x: sg.trackX,
                y: sg.toY - d,
            });
            pathData.push({
                segType: "curveTo",
                cp1x: sg.trackX + ADR,
                cp1y: sg.toY,
                cp2x: sg.trackX + ADR,
                cp2y: sg.toY,
                toX: sg.toX,
                toY: sg.toY,
            });
            return;
        }
        if (sg.segmentDirection === SegmentDirection.ImmediateDown ||
            sg.segmentDirection === SegmentDirection.ImmediateUp) {
            pathData.push({
                segType: "lineTo",
                x: sg.toX,
                y: sg.toY,
            });
            return;
        }
        throw new Error("Should not reach here");
    });
}
function cropLastBendForArrow(seg, ew) {
    const _CROP_LENGTH = ew;
    switch (seg.segmentDirection) {
        case SegmentDirection.LeftToRight:
            seg.toX -= _CROP_LENGTH;
            break;
        case SegmentDirection.RightToLeft:
            seg.toX += _CROP_LENGTH;
            break;
        case SegmentDirection.VerticalAroundDown:
            seg.toX -= _CROP_LENGTH;
            break;
        case SegmentDirection.VerticalAroundUp:
            seg.toX -= _CROP_LENGTH;
            break;
        case SegmentDirection.ImmediateDown:
            seg.toY -= _CROP_LENGTH;
            break;
        case SegmentDirection.ImmediateUp:
            seg.toY += _CROP_LENGTH;
            break;
    }
}
