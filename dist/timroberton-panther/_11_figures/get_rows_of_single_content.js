export function getRowsOfSingleContent(content, nChartsPerRow, nSlotsToSkip) {
    const toAllocate = [
        ...new Array(nSlotsToSkip).fill("blank"),
        ...content,
    ];
    return toAllocate.reduce((resultArray, c, index) => {
        const chunkIndex = Math.floor(index / nChartsPerRow);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(c);
        return resultArray;
    }, []);
}
