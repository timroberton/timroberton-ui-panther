export function getColGroupsExpandedFromDataColRow(data) {
    const colGroups = data.colGroups
        ? data.colGroups.map((cg) => {
            return {
                display: cg.label !== undefined && !!cg.label.trim(),
                label: cg.label ?? "",
                cols: cg.colNumbers.map((colNumber) => {
                    return {
                        colIndexInAoA: colNumber - 1,
                        coords: {
                            x: -1,
                            cx: -1,
                            y: -1,
                            cy: -1,
                            w: -1,
                            h: -1,
                        },
                    };
                }),
            };
        })
        : [
            {
                display: false,
                label: "",
                cols: data.colHeaders.map((_, i) => {
                    return {
                        colIndexInAoA: i,
                        coords: {
                            x: -1,
                            cx: -1,
                            y: -1,
                            cy: -1,
                            w: -1,
                            h: -1,
                        },
                    };
                }),
            },
        ];
    colGroups.forEach((cg) => {
        cg.cols.forEach((cgc) => {
            if (cgc.colIndexInAoA < 0 ||
                cgc.colIndexInAoA > data.colHeaders.length - 1) {
                throw new Error("Col group col numbers don't match colHeaders");
            }
        });
    });
    const showColGroupLabelsAndBracket = colGroups.some((cg) => cg.display);
    return {
        colGroups,
        showColGroupLabelsAndBracket,
    };
}
