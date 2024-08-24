export function updateTileCoords(tiles, tileCoordMap, columns) {
    tiles.forEach((tile) => {
        const tc = tileCoordMap[tile.id];
        tc.xl = columns[tc.finalFromLayer].xl;
        tc.xr = columns[tc.finalToLayer].xr;
        tc.yt = columns[tc.finalFromLayer].yt;
        tc.yb = columns[tc.finalFromLayer].yb;
    });
}
