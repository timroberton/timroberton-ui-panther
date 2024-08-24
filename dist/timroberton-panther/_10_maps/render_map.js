import { getMapStyle, getStyleValOrFuncValTwoArgs, } from "./_style/mod.ts";
import { Coordinates, Dimensions, Padding, addPoint, assertNotUndefined, getAdjustedColor, getColor, } from "./deps.ts";
import { getPixelVals } from "./get_pixel_vals.ts";
import { getPopMapAsImageData } from "./get_pop_map_as_image_data.ts";
import { validatePopMapData } from "./validate_pop_map_data.ts";
export function renderMapBoundedDims(ctx, inputs, rcd, canvasCreator) {
    assertNotUndefined(canvasCreator, "To render maps, need a canvas creator");
    const d = inputs.mapData;
    const s = getMapStyle(inputs.mapStyle);
    if (typeof d === "string") {
        throw new Error("String map data does not work in browser");
    }
    // Get inner canvas
    const pad = new Padding(s.padding);
    const innerCanvas = canvasCreator(d.pixW + pad.totalPx(), d.pixH + pad.totalPy());
    const innerCtx = innerCanvas.getContext("2d");
    renderMapCore(innerCtx, d, s, new Coordinates([pad.pl(), pad.pt()]));
    // Render outer canvas
    if (s.backgroundColor !== "none") {
        ctx.fillStyle = getColor(s.backgroundColor);
        ctx.fillRect(rcd.x(), rcd.y(), rcd.w(), rcd.h());
    }
    const innerDims = new Dimensions([innerCanvas.width, innerCanvas.height]);
    const innerRcd = rcd.getScaledAndCenteredInnerDimsAsRcd(innerDims);
    ctx.drawImage(innerCanvas, innerRcd.x(), innerRcd.y(), innerRcd.w(), innerRcd.h());
}
export function renderMapExactDims(ctx, inputs, outerRcd, coords) {
    const d = inputs.mapData;
    const s = getMapStyle(inputs.mapStyle);
    if (typeof d === "string") {
        throw new Error("String map data does not work in browser");
    }
    renderMapCore(ctx, d, s, coords);
    if (s.backgroundColor !== "none") {
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = getColor(s.backgroundColor);
        ctx.fillRect(outerRcd.x(), outerRcd.y(), outerRcd.w(), outerRcd.h());
    }
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function renderMapCore(ctx, d, s, coords) {
    validatePopMapData(d);
    // Population
    const popMap = getPopMapAsImageData(d, s);
    ctx.putImageData(popMap, coords.x(), coords.y());
    // Facilities
    renderFacilities(ctx, d, s);
}
function renderFacilities(ctx, d, s) {
    if (d.facs) {
        const pad = new Padding(s.padding);
        const nFacilities = d.facs.facLocations.length / 2;
        for (let iFac = 0; iFac < nFacilities; iFac++) {
            const facX = d.facs.facLocations[iFac * 2];
            const facY = d.facs.facLocations[iFac * 2 + 1];
            if (facX === -9999 && facY === -9999) {
                continue;
            }
            if (facX < 0 || facX >= d.pixW || facY < 0 || facY >= d.pixH) {
                continue;
            }
            const iPixInOriginal = facX + facY * d.pixW;
            const pixelVals = getPixelVals(d, iPixInOriginal);
            const facValue = d.facs.facValues?.[iFac];
            if (s.filterFacs && !s.filterFacs(facValue, pixelVals)) {
                continue;
            }
            const pointColorKey = getStyleValOrFuncValTwoArgs(s.pointColor, facValue, pixelVals);
            const pointColor = getColor(pointColorKey);
            const pointStyle = getStyleValOrFuncValTwoArgs(s.pointStyle, facValue, pixelVals);
            const pointRadius = getStyleValOrFuncValTwoArgs(s.pointRadius, facValue, pixelVals);
            const pointStrokeWidth = getStyleValOrFuncValTwoArgs(s.pointStrokeWidth, facValue, pixelVals);
            addPoint(ctx, pointStyle, facX + pad.pl(), facY + pad.pt(), pointRadius, pointColor, pointStrokeWidth, getAdjustedColor(pointColor, { opacity: 0.5 }));
        }
    }
}
