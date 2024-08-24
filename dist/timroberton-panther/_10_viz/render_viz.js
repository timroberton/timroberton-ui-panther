import { getPositionsSimple, } from "./_positions/mod.ts";
import { assertNotUndefined } from "./deps.ts";
export function renderViz(ctx, inputs, rpd) {
    const positionInfo = getPositionsSimple(inputs.vizData, inputs.vizStyle);
    inputs.vizData.tiles.forEach((tile) => {
        const pi = positionInfo.tileCoordMap[tile.id];
        assertNotUndefined(pi);
        ctx.fillStyle = "pink";
        ctx.fillRect(rpd.x() + pi.xl, rpd.y() + pi.yt, pi.xr - pi.xl, pi.yb - pi.yt);
    });
    inputs.vizData.nodes.forEach((node) => {
        const pi = positionInfo.nodeCoordMap[node.id];
        assertNotUndefined(pi);
        ctx.fillStyle = "red";
        ctx.fillRect(rpd.x() + pi.x, rpd.y() + pi.y, pi.w, pi.h);
    });
    inputs.vizData.edges.forEach((edge) => {
        const pi = positionInfo.edgeCoordMap[edge.id];
        assertNotUndefined(pi);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "purple";
        ctx.beginPath();
        pi.pathData.forEach((pathDataSeg) => {
            if (pathDataSeg.segType === "moveTo") {
                ctx.moveTo(rpd.x() + pathDataSeg.x, rpd.y() + pathDataSeg.y);
            }
            else if (pathDataSeg.segType === "lineTo") {
                ctx.lineTo(rpd.x() + pathDataSeg.x, rpd.y() + pathDataSeg.y);
            }
            else if (pathDataSeg.segType === "curveTo") {
                ctx.bezierCurveTo(rpd.x() + pathDataSeg.cp1x, rpd.y() + pathDataSeg.cp1y, rpd.x() + pathDataSeg.cp2x, rpd.y() + pathDataSeg.cp2y, rpd.x() + pathDataSeg.toX, rpd.y() + pathDataSeg.toY);
            }
        });
        ctx.stroke();
    });
}
