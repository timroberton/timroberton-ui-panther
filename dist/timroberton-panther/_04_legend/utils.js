export function getLegendItemsInGroups(legendItems, maxLegendItemsInOneColumn) {
    if (maxLegendItemsInOneColumn instanceof Array) {
        let startIndex = 0;
        return maxLegendItemsInOneColumn.map((n) => {
            const i = startIndex;
            startIndex += n;
            return legendItems.slice(i, i + n);
        });
    }
    else {
        const nItemsPerGroup = getNumberItemsPerGroup(legendItems.length, maxLegendItemsInOneColumn);
        return legendItems.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / nItemsPerGroup);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);
    }
}
function getNumberItemsPerGroup(nLegendItems, maxLegendItemsInOneColumn) {
    const columnsNeeded = Math.ceil(nLegendItems / maxLegendItemsInOneColumn);
    return Math.ceil(nLegendItems / columnsNeeded);
}
