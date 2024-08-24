import { assert, assertNotUndefined, assertUnique, createArray, getSortedAlphabetical, getUnique, getValidNumberOrThrowError, sum, } from "./deps.ts";
import { parseStrToAoA } from "./parse_csv.ts";
import { copyHeadersNoneOrArray } from "./utils.ts";
export class Csv {
    _colHeaders;
    _rowHeaders;
    _aoa;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   ______                                   __                                      __                          //
    //  /      \                                 /  |                                    /  |                         //
    // /$$$$$$  |  ______   _______    _______  _$$ |_     ______   __    __   _______  _$$ |_     ______    ______   //
    // $$ |  $$/  /      \ /       \  /       |/ $$   |   /      \ /  |  /  | /       |/ $$   |   /      \  /      \  //
    // $$ |      /$$$$$$  |$$$$$$$  |/$$$$$$$/ $$$$$$/   /$$$$$$  |$$ |  $$ |/$$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$  | //
    // $$ |   __ $$ |  $$ |$$ |  $$ |$$      \   $$ | __ $$ |  $$/ $$ |  $$ |$$ |        $$ | __ $$ |  $$ |$$ |  $$/  //
    // $$ \__/  |$$ \__$$ |$$ |  $$ | $$$$$$  |  $$ |/  |$$ |      $$ \__$$ |$$ \_____   $$ |/  |$$ \__$$ |$$ |       //
    // $$    $$/ $$    $$/ $$ |  $$ |/     $$/   $$  $$/ $$ |      $$    $$/ $$       |  $$  $$/ $$    $$/ $$ |       //
    //  $$$$$$/   $$$$$$/  $$/   $$/ $$$$$$$/     $$$$/  $$/        $$$$$$/   $$$$$$$/    $$$$/   $$$$$$/  $$/        //
    //                                                                                                                //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(opts) {
        if (opts === undefined) {
            this._colHeaders = "none";
            this._rowHeaders = "none";
            this._aoa = [];
            return;
        }
        if (opts instanceof Csv) {
            this._colHeaders = opts.colHeaders();
            this._rowHeaders = opts.rowHeaders();
            this._aoa = opts._aoa.map((row) => row.map((cell) => cell));
            this.validate();
            return;
        }
        if (opts instanceof Array) {
            this._colHeaders = [...opts];
            this._rowHeaders = "none";
            this._aoa = [];
            this.validate();
            return;
        }
        if (opts.aoa === undefined || opts.aoa.length === 0) {
            if (opts.rowHeaders instanceof Array) {
                throw new Error("Csv constructor cannot receive row headers if no aoa");
            }
            this._colHeaders = copyHeadersNoneOrArray(opts.colHeaders ?? "none");
            this._rowHeaders = "none";
            this._aoa = [];
            this.validate();
            return;
        }
        if (opts.rowHeaders instanceof Array &&
            opts.rowHeaders.length !== opts.aoa.length) {
            throw new Error("Csv row headers not equal to aoa");
        }
        if (opts.colHeaders instanceof Array &&
            opts.colHeaders.length !== opts.aoa[0].length) {
            throw new Error("Csv col headers not equal to aoa");
        }
        this._colHeaders = copyHeadersNoneOrArray(opts.colHeaders ?? "none");
        this._rowHeaders = copyHeadersNoneOrArray(opts.rowHeaders ?? "none");
        this._aoa = opts.aoa.map((row) => row.map((cell) => cell));
        this.validate();
    }
    ///////////////////////////////////////////////////////////
    //   ______    __                  __      __            //
    //  /      \  /  |                /  |    /  |           //
    // /$$$$$$  |_$$ |_     ______   _$$ |_   $$/   _______  //
    // $$ \__$$// $$   |   /      \ / $$   |  /  | /       | //
    // $$      \$$$$$$/    $$$$$$  |$$$$$$/   $$ |/$$$$$$$/  //
    //  $$$$$$  | $$ | __  /    $$ |  $$ | __ $$ |$$ |       //
    // /  \__$$ | $$ |/  |/$$$$$$$ |  $$ |/  |$$ |$$ \_____  //
    // $$    $$/  $$  $$/ $$    $$ |  $$  $$/ $$ |$$       | //
    //  $$$$$$/    $$$$/   $$$$$$$/    $$$$/  $$/  $$$$$$$/  //
    //                                                       //
    ///////////////////////////////////////////////////////////
    static fromString(str, opts) {
        const aoa = parseStrToAoA(str);
        return this.fromAoA(aoa, opts);
    }
    static fromAoA(rawAoa, opts) {
        const goodOpts = {
            colHeaders: opts?.colHeaders ?? "use-first-row",
            rowHeaders: opts?.rowHeaders ?? "use-first-col",
        };
        if (rawAoa.length === 0) {
            throw new Error("CSV has no rows");
        }
        if (rawAoa[0].length === 0) {
            throw new Error("CSV has no columns");
        }
        if (goodOpts.colHeaders === "use-first-row" && rawAoa.length === 1) {
            throw new Error("CSV does not have enough rows when using first row as col headers");
        }
        if (goodOpts.colHeaders === "none" && goodOpts.rowHeaders === "none") {
            return new Csv({
                aoa: rawAoa.map((row) => row.map((cell) => cell)),
                colHeaders: "none",
                rowHeaders: "none",
            });
        }
        if (goodOpts.colHeaders === "use-first-row" &&
            goodOpts.rowHeaders === "none") {
            return new Csv({
                aoa: rawAoa.slice(1).map((row) => row.map((cell) => cell)),
                colHeaders: rawAoa.at(0).map((header) => header.trim()),
                rowHeaders: "none",
            });
        }
        if (goodOpts.colHeaders === "none" &&
            goodOpts.rowHeaders === "use-first-col") {
            return new Csv({
                aoa: rawAoa.map((row) => row.slice(1).map((cell) => cell)),
                colHeaders: "none",
                rowHeaders: rawAoa.map((row) => row.at(0).trim()),
            });
        }
        return new Csv({
            aoa: rawAoa.slice(1).map((row) => row.slice(1).map((cell) => cell)),
            colHeaders: rawAoa
                .at(0)
                .slice(1)
                .map((header) => header.trim()),
            rowHeaders: rawAoa.slice(1).map((row) => row.at(0).trim()),
        });
    }
    static fromObjectArray(arr) {
        if (arr.length === 0) {
            throw new Error("Array is of length 0");
        }
        const colHeaders = [];
        for (const k in arr[0]) {
            colHeaders.push(k);
        }
        if (colHeaders.length === 0) {
            throw new Error("Array has object with no properties");
        }
        const aoa = arr.map((obj) => {
            const row = [];
            colHeaders.forEach((colHeader) => {
                const cell = obj[colHeader];
                // if (!cell || typeof cell !== dataType) {
                //   throw new Error("Bad, undefined, or inconsistent cell values");
                // }
                row.push(String(cell));
            });
            return row;
        });
        return new Csv({
            colHeaders,
            rowHeaders: "none",
            aoa,
        });
    }
    ///////////////////////////////////////////////////////////////////////////////
    //  __       __              __      __                        __            //
    // /  \     /  |            /  |    /  |                      /  |           //
    // $$  \   /$$ |  ______   _$$ |_   $$ |____    ______    ____$$ |  _______  //
    // $$$  \ /$$$ | /      \ / $$   |  $$      \  /      \  /    $$ | /       | //
    // $$$$  /$$$$ |/$$$$$$  |$$$$$$/   $$$$$$$  |/$$$$$$  |/$$$$$$$ |/$$$$$$$/  //
    // $$ $$ $$/$$ |$$    $$ |  $$ | __ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$      \  //
    // $$ |$$$/ $$ |$$$$$$$$/   $$ |/  |$$ |  $$ |$$ \__$$ |$$ \__$$ | $$$$$$  | //
    // $$ | $/  $$ |$$       |  $$  $$/ $$ |  $$ |$$    $$/ $$    $$ |/     $$/  //
    // $$/      $$/  $$$$$$$/    $$$$/  $$/   $$/  $$$$$$/   $$$$$$$/ $$$$$$$/   //
    //                                                                           //
    ///////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////
    //  ______             ______           //
    // /      |           /      \          //
    // $$$$$$/  _______  /$$$$$$  |______   //
    //   $$ |  /       \ $$ |_ $$//      \  //
    //   $$ |  $$$$$$$  |$$   |  /$$$$$$  | //
    //   $$ |  $$ |  $$ |$$$$/   $$ |  $$ | //
    //  _$$ |_ $$ |  $$ |$$ |    $$ \__$$ | //
    // / $$   |$$ |  $$ |$$ |    $$    $$/  //
    // $$$$$$/ $$/   $$/ $$/      $$$$$$/   //
    //                                      //
    //////////////////////////////////////////
    dataType() {
        return typeof this._aoa[0]?.[0];
    }
    colHeaders() {
        if (this._colHeaders === "none") {
            return "none";
        }
        return [...this._colHeaders];
    }
    rowHeaders() {
        if (this._rowHeaders === "none") {
            return "none";
        }
        return [...this._rowHeaders];
    }
    colHeadersOrThrowIfNone() {
        if (this._colHeaders === "none") {
            throw new Error("Col headers are none");
        }
        return [...this._colHeaders];
    }
    rowHeadersOrThrowIfNone() {
        if (this._rowHeaders === "none") {
            throw new Error("Row headers are none");
        }
        return [...this._rowHeaders];
    }
    aoa() {
        return this._aoa.map((row) => row.map((cell) => cell));
    }
    nCols() {
        if (this._colHeaders === "none") {
            if (this._aoa.length === 0) {
                return 0;
            }
            return this._aoa[0].length;
        }
        if (this._aoa.length === 0) {
            return this._colHeaders.length;
        }
        if (this._colHeaders.length !== this._aoa[0].length) {
            throw new Error("Csv has bad column headers, no equal to aoa");
        }
        return this._colHeaders.length;
    }
    nRows() {
        if (this._rowHeaders === "none") {
            return this._aoa.length;
        }
        if (this._rowHeaders.length !== this._aoa.length) {
            throw new Error("Csv has bad row headers, no equal to aoa");
        }
        return this._rowHeaders.length;
    }
    //////////////////////////////////////////////////////////////////////
    //  __    __            __                                          //
    // /  |  /  |          /  |                                         //
    // $$ |  $$ |  ______  $$ |  ______    ______    ______    _______  //
    // $$ |__$$ | /      \ $$ | /      \  /      \  /      \  /       | //
    // $$    $$ |/$$$$$$  |$$ |/$$$$$$  |/$$$$$$  |/$$$$$$  |/$$$$$$$/  //
    // $$$$$$$$ |$$    $$ |$$ |$$ |  $$ |$$    $$ |$$ |  $$/ $$      \  //
    // $$ |  $$ |$$$$$$$$/ $$ |$$ |__$$ |$$$$$$$$/ $$ |       $$$$$$  | //
    // $$ |  $$ |$$       |$$ |$$    $$/ $$       |$$ |      /     $$/  //
    // $$/   $$/  $$$$$$$/ $$/ $$$$$$$/   $$$$$$$/ $$/       $$$$$$$/   //
    //                         $$ |                                     //
    //                         $$ |                                     //
    //                         $$/                                      //
    //                                                                  //
    //////////////////////////////////////////////////////////////////////
    getColHeaderIndex(numberOrHeader) {
        return this.getHeaderIndex(numberOrHeader, "cols");
    }
    getRowHeaderIndex(numberOrHeader) {
        if (typeof numberOrHeader === "function") {
            for (let i = 0; i < this._aoa.length; i++) {
                const row = this._aoa[i];
                if (numberOrHeader(row, i, this)) {
                    return i;
                }
            }
            throw new Error("Could not find row");
        }
        return this.getHeaderIndex(numberOrHeader, "rows");
    }
    getColHeaderIndexes(numbersOrHeaders) {
        return this.getHeaderIndexes(numbersOrHeaders, "cols");
    }
    getRowHeaderIndexes(numbersOrHeaders) {
        if (typeof numbersOrHeaders === "function") {
            return this.getRowsAsMappedArray((row, i_row, csv) => numbersOrHeaders(row, i_row, csv) ? i_row : -1).filter((i_row) => i_row >= 0);
        }
        return this.getHeaderIndexes(numbersOrHeaders, "rows");
    }
    getHeaderIndexes(numbersOrHeaders, colsOrRows) {
        return numbersOrHeaders.map((numberOrHeader) => this.getHeaderIndex(numberOrHeader, colsOrRows));
    }
    getHeaderIndex(numberOrHeader, colsOrRows) {
        if (typeof numberOrHeader === "number") {
            const index = numberOrHeader - 1;
            if (colsOrRows === "cols") {
                this.validateColIndex(index);
            }
            else {
                this.validateRowIndex(index);
            }
            return index;
        }
        if (colsOrRows === "cols") {
            const index = this.colHeadersOrThrowIfNone().indexOf(numberOrHeader);
            this.validateColIndex(index);
            return index;
        }
        if (colsOrRows === "rows") {
            const index = this.rowHeadersOrThrowIfNone().indexOf(numberOrHeader);
            this.validateRowIndex(index);
            return index;
        }
        throw new Error("Should not happen");
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    //  ______  __                                     __                                    //
    // /      |/  |                                   /  |                                   //
    // $$$$$$/_$$ |_     ______    ______   ______   _$$ |_     ______    ______    _______  //
    //   $$ |/ $$   |   /      \  /      \ /      \ / $$   |   /      \  /      \  /       | //
    //   $$ |$$$$$$/   /$$$$$$  |/$$$$$$  |$$$$$$  |$$$$$$/   /$$$$$$  |/$$$$$$  |/$$$$$$$/  //
    //   $$ |  $$ | __ $$    $$ |$$ |  $$/ /    $$ |  $$ | __ $$ |  $$ |$$ |  $$/ $$      \  //
    //  _$$ |_ $$ |/  |$$$$$$$$/ $$ |     /$$$$$$$ |  $$ |/  |$$ \__$$ |$$ |       $$$$$$  | //
    // / $$   |$$  $$/ $$       |$$ |     $$    $$ |  $$  $$/ $$    $$/ $$ |      /     $$/  //
    // $$$$$$/  $$$$/   $$$$$$$/ $$/       $$$$$$$/    $$$$/   $$$$$$/  $$/       $$$$$$$/   //
    //                                                                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////
    forEachRow(func) {
        this._aoa.forEach((row, i_row) => {
            func(row, i_row, this);
        });
    }
    //////////////////////////////////////////////////////////////////////////
    //  __     __           __  __        __              __                //
    // /  |   /  |         /  |/  |      /  |            /  |               //
    // $$ |   $$ | ______  $$ |$$/   ____$$ |  ______   _$$ |_     ______   //
    // $$ |   $$ |/      \ $$ |/  | /    $$ | /      \ / $$   |   /      \  //
    // $$  \ /$$/ $$$$$$  |$$ |$$ |/$$$$$$$ | $$$$$$  |$$$$$$/   /$$$$$$  | //
    //  $$  /$$/  /    $$ |$$ |$$ |$$ |  $$ | /    $$ |  $$ | __ $$    $$ | //
    //   $$ $$/  /$$$$$$$ |$$ |$$ |$$ \__$$ |/$$$$$$$ |  $$ |/  |$$$$$$$$/  //
    //    $$$/   $$    $$ |$$ |$$ |$$    $$ |$$    $$ |  $$  $$/ $$       | //
    //     $/     $$$$$$$/ $$/ $$/  $$$$$$$/  $$$$$$$/    $$$$/   $$$$$$$/  //
    //                                                                      //
    //////////////////////////////////////////////////////////////////////////
    assertNumberCsv() {
        assert(this.dataType() === "number", "Must be csv data type number");
    }
    assertStringCsv() {
        assert(this.dataType() === "string", "Must be csv data type string");
    }
    validate() {
        if (this._colHeaders instanceof Array) {
            assert(this._aoa.length === 0 ||
                this._colHeaders.length === this._aoa[0].length);
            assertUnique(this._colHeaders);
        }
        if (this._rowHeaders instanceof Array) {
            assert(this._rowHeaders.length === this._aoa.length);
            assertUnique(this._rowHeaders);
        }
    }
    validateColIndex(colIndex) {
        if (colIndex < 0 || colIndex >= this.nCols()) {
            throw new Error("Col index is not right for this csv: " + colIndex);
        }
    }
    validateColHeader(colHeader) {
        if (!this.colHeadersOrThrowIfNone().includes(colHeader)) {
            throw new Error("Col header does not exist in this csv: " + colHeader);
        }
    }
    validateRowIndex(rowIndex) {
        if (rowIndex < 0 || rowIndex >= this.nRows()) {
            throw new Error("Row index is not right for this csv");
        }
    }
    validateRowHeader(rowHeader) {
        if (!this.rowHeadersOrThrowIfNone().includes(rowHeader)) {
            throw new Error("Row header does not exist in this csv: " + rowHeader);
        }
    }
    /////////////////////////////////////////////////////////////////////
    //  __       __              __                  __                //
    // /  \     /  |            /  |                /  |               //
    // $$  \   /$$ | __    __  _$$ |_     ______   _$$ |_     ______   //
    // $$$  \ /$$$ |/  |  /  |/ $$   |   /      \ / $$   |   /      \  //
    // $$$$  /$$$$ |$$ |  $$ |$$$$$$/    $$$$$$  |$$$$$$/   /$$$$$$  | //
    // $$ $$ $$/$$ |$$ |  $$ |  $$ | __  /    $$ |  $$ | __ $$    $$ | //
    // $$ |$$$/ $$ |$$ \__$$ |  $$ |/  |/$$$$$$$ |  $$ |/  |$$$$$$$$/  //
    // $$ | $/  $$ |$$    $$/   $$  $$/ $$    $$ |  $$  $$/ $$       | //
    // $$/      $$/  $$$$$$/     $$$$/   $$$$$$$/    $$$$/   $$$$$$$/  //
    //                                                                 //
    /////////////////////////////////////////////////////////////////////
    MUTATE_updateColHeaders(newColHeaders) {
        if (newColHeaders === "none") {
            this._colHeaders = "none";
        }
        else {
            assert(this.nRows() === 0 || this.nCols() === newColHeaders.length, "New col headers not correct length");
            this._colHeaders = [...newColHeaders];
        }
        this.validate();
    }
    withUpdatedColHeaders(newColHeaders) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_updateColHeaders(newColHeaders);
        return newCsv;
    }
    withMappedColHeaders(func) {
        const newCsv = this.getCopy();
        const colHeaders = this.colHeadersOrThrowIfNone();
        newCsv.MUTATE_updateColHeaders(colHeaders.map(func));
        return newCsv;
    }
    MUTATE_updateRowHeaders(newRowHeaders) {
        if (newRowHeaders === "none") {
            this._rowHeaders = "none";
        }
        else {
            assert(this.nRows() === newRowHeaders.length, "New row headers not correct length");
            this._rowHeaders = [...newRowHeaders];
        }
        this.validate();
    }
    withUpdatedRowHeaders(newRowHeaders) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_updateRowHeaders(newRowHeaders);
        return newCsv;
    }
    withMappedRowHeaders(func) {
        const newCsv = this.getCopy();
        const rowHeaders = this.rowHeadersOrThrowIfNone();
        newCsv.MUTATE_updateRowHeaders(rowHeaders.map(func));
        return newCsv;
    }
    withColAsRowHeaders(colNumberOrHeader) {
        assert(this._rowHeaders === "none", "Already has row headers");
        const newRowHeaders = this.getColVals(colNumberOrHeader).map(String);
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        const newColHeaders = this._colHeaders === "none"
            ? "none"
            : this._colHeaders.filter((_, i) => i !== colIndex);
        const newCsv = new Csv({
            rowHeaders: newRowHeaders,
            colHeaders: newColHeaders,
            aoa: this._aoa.map((row) => row.filter((_, i) => i !== colIndex)),
        });
        newCsv.validate();
        return newCsv;
    }
    MUTATE_updateCol(colNumberOrHeader, mapFunc) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        this._aoa.forEach((row) => {
            row[colIndex] = mapFunc(row[colIndex], row, this);
        });
        this.validate();
    }
    //////////////////////////////////////////////////////////////////////////////////////
    //   ______         __        __                                                    //
    //  /      \       /  |      /  |                                                   //
    // /$$$$$$  |  ____$$ |  ____$$ |        ______    ______   __   __   __   _______  //
    // $$ |__$$ | /    $$ | /    $$ |       /      \  /      \ /  | /  | /  | /       | //
    // $$    $$ |/$$$$$$$ |/$$$$$$$ |      /$$$$$$  |/$$$$$$  |$$ | $$ | $$ |/$$$$$$$/  //
    // $$$$$$$$ |$$ |  $$ |$$ |  $$ |      $$ |  $$/ $$ |  $$ |$$ | $$ | $$ |$$      \  //
    // $$ |  $$ |$$ \__$$ |$$ \__$$ |      $$ |      $$ \__$$ |$$ \_$$ \_$$ | $$$$$$  | //
    // $$ |  $$ |$$    $$ |$$    $$ |      $$ |      $$    $$/ $$   $$   $$/ /     $$/  //
    // $$/   $$/  $$$$$$$/  $$$$$$$/       $$/        $$$$$$/   $$$$$/$$$$/  $$$$$$$/   //
    //                                                                                  //
    //////////////////////////////////////////////////////////////////////////////////////
    MUTATE_addRow(rowOrRowVal, rowHeader) {
        if (rowOrRowVal instanceof Array &&
            (this.nRows() > 0 || this._colHeaders !== "none") &&
            rowOrRowVal.length !== this.nCols()) {
            throw new Error("New row not equal in length to csv number of cols");
        }
        if (rowHeader === undefined) {
            if (this._rowHeaders !== "none") {
                throw new Error("Csv needs row header");
            }
        }
        else {
            if (this._rowHeaders === "none") {
                if (this.nRows() > 0) {
                    throw new Error("Csv does not have row headers");
                }
                else {
                    this._rowHeaders = [];
                }
            }
            this._rowHeaders.push(rowHeader);
        }
        if (rowOrRowVal instanceof Array) {
            this._aoa.push([...rowOrRowVal]);
        }
        else {
            this._aoa.push(new Array(this.nCols()).fill(0).map(() => structuredClone(rowOrRowVal)));
        }
        this.validate();
    }
    withAddedRow(rowOrRowVal, rowHeader) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_addRow(rowOrRowVal, rowHeader);
        return newCsv;
    }
    MUTATE_addRows(nRows, func) {
        createArray(nRows).forEach((index) => {
            const v = func(index);
            if ((this.nRows() > 0 || this._colHeaders !== "none") &&
                v.row.length !== this.nCols()) {
                throw new Error("New row not equal in length to csv number of cols");
            }
            if (v.rowHeader === undefined) {
                if (this._rowHeaders !== "none") {
                    throw new Error("Csv needs row header");
                }
            }
            else {
                if (this._rowHeaders === "none") {
                    if (this.nRows() > 0) {
                        throw new Error("Csv does not have row headers");
                    }
                    else {
                        this._rowHeaders = [];
                    }
                }
                this._rowHeaders.push(v.rowHeader);
            }
            this._aoa.push([...v.row]);
        });
        this.validate();
    }
    withAddedRows(nRows, func) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_addRows(nRows, func);
        return newCsv;
    }
    ////////////////////////////////////////////////////////////////////////////
    //   ______         __        __                            __            //
    //  /      \       /  |      /  |                          /  |           //
    // /$$$$$$  |  ____$$ |  ____$$ |        _______   ______  $$ |  _______  //
    // $$ |__$$ | /    $$ | /    $$ |       /       | /      \ $$ | /       | //
    // $$    $$ |/$$$$$$$ |/$$$$$$$ |      /$$$$$$$/ /$$$$$$  |$$ |/$$$$$$$/  //
    // $$$$$$$$ |$$ |  $$ |$$ |  $$ |      $$ |      $$ |  $$ |$$ |$$      \  //
    // $$ |  $$ |$$ \__$$ |$$ \__$$ |      $$ \_____ $$ \__$$ |$$ | $$$$$$  | //
    // $$ |  $$ |$$    $$ |$$    $$ |      $$       |$$    $$/ $$ |/     $$/  //
    // $$/   $$/  $$$$$$$/  $$$$$$$/        $$$$$$$/  $$$$$$/  $$/ $$$$$$$/   //
    //                                                                        //
    ////////////////////////////////////////////////////////////////////////////
    MUTATE_addCol(colOrColVal, colHeader) {
        if (colOrColVal instanceof Array && colOrColVal.length !== this.nRows()) {
            throw new Error("New cols not equal in length to csv number of rows");
        }
        if (colHeader === undefined) {
            if (this._colHeaders !== "none") {
                throw new Error("Csv needs col header");
            }
        }
        else {
            if (this._colHeaders === "none") {
                if (this.nCols() > 0) {
                    throw new Error("Csv does not have col headers");
                }
                else {
                    this._colHeaders = [];
                }
            }
            this._colHeaders.push(colHeader);
        }
        this._aoa.forEach((row, i_row) => {
            row.push(colOrColVal instanceof Array ? colOrColVal[i_row] : colOrColVal);
        });
        this.validate();
    }
    withAddedCol(colOrColVal, colHeader) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_addCol(colOrColVal, colHeader);
        return newCsv;
    }
    withTotalRowAndColumn() {
        this.assertNumberCsv();
        const totalRow = this
            .collapseAllAsNumbers(sum)
            .withUpdatedRowHeaders(["Total"]);
        const finalCsv = this.joinRowsWithMatchedColHeaders(totalRow);
        const rowTotals = finalCsv.getRowsAsMappedArray((row) => sum(row));
        return finalCsv.withAddedCol(rowTotals, "Total");
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  _______                                                                                   __            //
    // /       \                                                                                 /  |           //
    // $$$$$$$  |  ______   _____  ____    ______   __     __  ______          _______   ______  $$ |  _______  //
    // $$ |__$$ | /      \ /     \/    \  /      \ /  \   /  |/      \        /       | /      \ $$ | /       | //
    // $$    $$< /$$$$$$  |$$$$$$ $$$$  |/$$$$$$  |$$  \ /$$//$$$$$$  |      /$$$$$$$/ /$$$$$$  |$$ |/$$$$$$$/  //
    // $$$$$$$  |$$    $$ |$$ | $$ | $$ |$$ |  $$ | $$  /$$/ $$    $$ |      $$ |      $$ |  $$ |$$ |$$      \  //
    // $$ |  $$ |$$$$$$$$/ $$ | $$ | $$ |$$ \__$$ |  $$ $$/  $$$$$$$$/       $$ \_____ $$ \__$$ |$$ | $$$$$$  | //
    // $$ |  $$ |$$       |$$ | $$ | $$ |$$    $$/    $$$/   $$       |      $$       |$$    $$/ $$ |/     $$/  //
    // $$/   $$/  $$$$$$$/ $$/  $$/  $$/  $$$$$$/      $/     $$$$$$$/        $$$$$$$/  $$$$$$/  $$/ $$$$$$$/   //
    //                                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    MUTATE_removeCol(colNumberOrHeader) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        if (this._colHeaders !== "none") {
            this._colHeaders = this._colHeaders.filter((_, i) => i !== colIndex);
        }
        this._aoa = this._aoa.map((row) => {
            return row.filter((_, i) => i !== colIndex);
        });
        this.validate();
    }
    withRemovedCol(colNumberOrHeader) {
        const newCsv = this.getCopy();
        newCsv.MUTATE_removeCol(colNumberOrHeader);
        return newCsv;
    }
    ////////////////////////////////////////////////////////////////////////////
    //   ______               __                                __            //
    //  /      \             /  |                              /  |           //
    // /$$$$$$  |  ______   _$$ |_          __     __  ______  $$ |  _______  //
    // $$ | _$$/  /      \ / $$   |        /  \   /  |/      \ $$ | /       | //
    // $$ |/    |/$$$$$$  |$$$$$$/         $$  \ /$$/ $$$$$$  |$$ |/$$$$$$$/  //
    // $$ |$$$$ |$$    $$ |  $$ | __        $$  /$$/  /    $$ |$$ |$$      \  //
    // $$ \__$$ |$$$$$$$$/   $$ |/  |        $$ $$/  /$$$$$$$ |$$ | $$$$$$  | //
    // $$    $$/ $$       |  $$  $$/          $$$/   $$    $$ |$$ |/     $$/  //
    //  $$$$$$/   $$$$$$$/    $$$$/            $/     $$$$$$$/ $$/ $$$$$$$/   //
    //                                                                        //
    ////////////////////////////////////////////////////////////////////////////
    getCellVal(colNumberOrHeader, rowNumberOrHeader) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        const rowIndex = this.getHeaderIndex(rowNumberOrHeader, "rows");
        const val = this._aoa[rowIndex][colIndex];
        assertNotUndefined(val, "Cell value is undefined for some reason");
        return val;
    }
    getCellValRowFilterFunc(colNumberOrHeader, rowIndexFindIndexFunc) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        const rowIndex = this._aoa.findIndex((row, i_row) => rowIndexFindIndexFunc(row, i_row, this));
        assert(rowIndex !== -1, "Can't find row");
        const val = this._aoa[rowIndex][colIndex];
        assertNotUndefined(val, "Cell value is undefined for some reason");
        return val;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   ______               __                                __                                                                   //
    //  /      \             /  |                              /  |                                                                  //
    // /$$$$$$  |  ______   _$$ |_           _______   ______  $$ |        ______    ______    ______   ______   __    __   _______  //
    // $$ | _$$/  /      \ / $$   |         /       | /      \ $$ |       /      \  /      \  /      \ /      \ /  |  /  | /       | //
    // $$ |/    |/$$$$$$  |$$$$$$/         /$$$$$$$/ /$$$$$$  |$$ |       $$$$$$  |/$$$$$$  |/$$$$$$  |$$$$$$  |$$ |  $$ |/$$$$$$$/  //
    // $$ |$$$$ |$$    $$ |  $$ | __       $$ |      $$ |  $$ |$$ |       /    $$ |$$ |  $$/ $$ |  $$/ /    $$ |$$ |  $$ |$$      \  //
    // $$ \__$$ |$$$$$$$$/   $$ |/  |      $$ \_____ $$ \__$$ |$$ |      /$$$$$$$ |$$ |      $$ |     /$$$$$$$ |$$ \__$$ | $$$$$$  | //
    // $$    $$/ $$       |  $$  $$/       $$       |$$    $$/ $$ |      $$    $$ |$$ |      $$ |     $$    $$ |$$    $$ |/     $$/  //
    //  $$$$$$/   $$$$$$$/    $$$$/         $$$$$$$/  $$$$$$/  $$/        $$$$$$$/ $$/       $$/       $$$$$$$/  $$$$$$$ |$$$$$$$/   //
    //                                                                                                          /  \__$$ |           //
    //                                                                                                          $$    $$/            //
    //                                                                                                           $$$$$$/             //
    //                                                                                                                               //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getColVals(colNumberOrHeader) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        return this._aoa.map((row) => row[colIndex]);
    }
    getColValsWithFilter(colNumberOrHeader, filterFunc) {
        const colIndex = this.getHeaderIndex(colNumberOrHeader, "cols");
        return this._aoa
            .filter((row, i_row) => filterFunc(row, i_row, this))
            .map((row) => row[colIndex]);
    }
    getColValsAsUniqueAndSortedArrayOfStrings(colNumberOrHeader) {
        assert(this.dataType() === "string", "Must be csv data type of string");
        return getSortedAlphabetical(getUnique(this.getColVals(colNumberOrHeader)));
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   ______               __                                                                                                     //
    //  /      \             /  |                                                                                                    //
    // /$$$$$$  |  ______   _$$ |_           ______    ______   __   __   __         ______    ______    ______   ______   __    __  //
    // $$ | _$$/  /      \ / $$   |         /      \  /      \ /  | /  | /  |       /      \  /      \  /      \ /      \ /  |  /  | //
    // $$ |/    |/$$$$$$  |$$$$$$/         /$$$$$$  |/$$$$$$  |$$ | $$ | $$ |       $$$$$$  |/$$$$$$  |/$$$$$$  |$$$$$$  |$$ |  $$ | //
    // $$ |$$$$ |$$    $$ |  $$ | __       $$ |  $$/ $$ |  $$ |$$ | $$ | $$ |       /    $$ |$$ |  $$/ $$ |  $$/ /    $$ |$$ |  $$ | //
    // $$ \__$$ |$$$$$$$$/   $$ |/  |      $$ |      $$ \__$$ |$$ \_$$ \_$$ |      /$$$$$$$ |$$ |      $$ |     /$$$$$$$ |$$ \__$$ | //
    // $$    $$/ $$       |  $$  $$/       $$ |      $$    $$/ $$   $$   $$/       $$    $$ |$$ |      $$ |     $$    $$ |$$    $$ | //
    //  $$$$$$/   $$$$$$$/    $$$$/        $$/        $$$$$$/   $$$$$/$$$$/         $$$$$$$/ $$/       $$/       $$$$$$$/  $$$$$$$ | //
    //                                                                                                                    /  \__$$ | //
    //                                                                                                                    $$    $$/  //
    //                                                                                                                     $$$$$$/   //
    //                                                                                                                               //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getRowVals(rowNumberOrHeader) {
        const colIndex = this.getHeaderIndex(rowNumberOrHeader, "rows");
        return [...this._aoa[colIndex]];
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   ______               __                                                    __                                //
    //  /      \             /  |                                                  /  |                               //
    // /$$$$$$  |  ______   _$$ |_          __     __  ______    ______    _______ $$/   ______   _______    _______  //
    // $$ | _$$/  /      \ / $$   |        /  \   /  |/      \  /      \  /       |/  | /      \ /       \  /       | //
    // $$ |/    |/$$$$$$  |$$$$$$/         $$  \ /$$//$$$$$$  |/$$$$$$  |/$$$$$$$/ $$ |/$$$$$$  |$$$$$$$  |/$$$$$$$/  //
    // $$ |$$$$ |$$    $$ |  $$ | __        $$  /$$/ $$    $$ |$$ |  $$/ $$      \ $$ |$$ |  $$ |$$ |  $$ |$$      \  //
    // $$ \__$$ |$$$$$$$$/   $$ |/  |        $$ $$/  $$$$$$$$/ $$ |       $$$$$$  |$$ |$$ \__$$ |$$ |  $$ | $$$$$$  | //
    // $$    $$/ $$       |  $$  $$/          $$$/   $$       |$$ |      /     $$/ $$ |$$    $$/ $$ |  $$ |/     $$/  //
    //  $$$$$$/   $$$$$$$/    $$$$/            $/     $$$$$$$/ $$/       $$$$$$$/  $$/  $$$$$$/  $$/   $$/ $$$$$$$/   //
    //                                                                                                                //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCopy() {
        return new Csv(this);
    }
    getAsObject() {
        return {
            colHeaders: this.colHeaders(),
            rowHeaders: this.rowHeaders(),
            aoa: this.aoa(),
        };
    }
    getNumbers() {
        return this.getMappedCells(getValidNumberOrThrowError);
    }
    getStrings() {
        return this.getMappedCells(String);
    }
    getMappedCells(func) {
        return new Csv({
            colHeaders: this.colHeaders(),
            rowHeaders: this.rowHeaders(),
            aoa: this._aoa.map((row, i_row) => row.map((cell, i_cell) => func(cell, i_row, i_cell, this))),
        });
    }
    getMappedRows(func) {
        return new Csv({
            colHeaders: this.colHeaders(),
            rowHeaders: this.rowHeaders(),
            aoa: this._aoa.map((row, i_row) => {
                const newRow = func(row, i_row, this);
                assert(newRow.length === row.length, "Rows must be the same length as original");
                return newRow;
            }),
        });
    }
    getCompleteAoA(colHeaderForNewFirstCol) {
        if (this._colHeaders === "none" && colHeaderForNewFirstCol !== undefined) {
            throw new Error("There are no col headers, so don't need the function argument colHeaderForNewFirstCol");
        }
        const completeAoA = this.aoa();
        if (this._colHeaders !== "none") {
            completeAoA.unshift([...this.colHeadersOrThrowIfNone()]);
        }
        if (this._rowHeaders !== "none") {
            if (this._colHeaders === "none") {
                this._rowHeaders.forEach((header, i_header) => {
                    completeAoA[i_header].unshift(header);
                });
            }
            else {
                completeAoA[0].unshift(colHeaderForNewFirstCol ?? "");
                this._rowHeaders.forEach((header, i_header) => {
                    completeAoA[i_header + 1].unshift(header);
                });
            }
        }
        return completeAoA;
    }
    //////////////////////////////////////////////////////////////////////////////////
    //   ______    __                __                      __   ______            //
    //  /      \  /  |              /  |                    /  | /      \           //
    // /$$$$$$  |_$$ |_     ______  $$/  _______    ______  $$/ /$$$$$$  |__    __  //
    // $$ \__$$// $$   |   /      \ /  |/       \  /      \ /  |$$ |_ $$//  |  /  | //
    // $$      \$$$$$$/   /$$$$$$  |$$ |$$$$$$$  |/$$$$$$  |$$ |$$   |   $$ |  $$ | //
    //  $$$$$$  | $$ | __ $$ |  $$/ $$ |$$ |  $$ |$$ |  $$ |$$ |$$$$/    $$ |  $$ | //
    // /  \__$$ | $$ |/  |$$ |      $$ |$$ |  $$ |$$ \__$$ |$$ |$$ |     $$ \__$$ | //
    // $$    $$/  $$  $$/ $$ |      $$ |$$ |  $$ |$$    $$ |$$ |$$ |     $$    $$ | //
    //  $$$$$$/    $$$$/  $$/       $$/ $$/   $$/  $$$$$$$ |$$/ $$/       $$$$$$$ | //
    //                                            /  \__$$ |             /  \__$$ | //
    //                                            $$    $$/              $$    $$/  //
    //                                             $$$$$$/                $$$$$$/   //
    //                                                                              //
    //////////////////////////////////////////////////////////////////////////////////
    stringify() {
        return this.getCompleteAoA()
            .map((row) => row
            .map((cell) => typeof cell === "string"
            ? `"${cell.replace(/"/g, '""').trim()}"`
            : String(cell))
            .join(","))
            .join("\n");
    }
    //////////////////////////////////////////////
    //     _____                                //
    //    /     |                               //
    //    $$$$$ |  _______   ______   _______   //
    //       $$ | /       | /      \ /       \  //
    //  __   $$ |/$$$$$$$/ /$$$$$$  |$$$$$$$  | //
    // /  |  $$ |$$      \ $$ |  $$ |$$ |  $$ | //
    // $$ \__$$ | $$$$$$  |$$ \__$$ |$$ |  $$ | //
    // $$    $$/ /     $$/ $$    $$/ $$ |  $$ | //
    //  $$$$$$/  $$$$$$$/   $$$$$$/  $$/   $$/  //
    //                                          //
    //////////////////////////////////////////////
    getAsObjectArray(colHeadersToTake) {
        if (this._colHeaders === "none") {
            throw new Error("Need col headers to get as json array");
        }
        const colHeaders = colHeadersToTake?.map((colHeader) => {
            if (!this._colHeaders.includes(colHeader)) {
                throw new Error("No header in this csv called " + colHeader);
            }
            return colHeader;
        }) ?? this.colHeadersOrThrowIfNone();
        return this.aoa().map((row) => {
            return colHeaders.reduce((obj, colHeader, i_col) => {
                obj[colHeader] = row[i_col];
                return obj;
            }, {});
        });
    }
    getRowsAsMappedArray(func) {
        return this.aoa().map((row, i_row) => func(row, i_row, this));
    }
    getSingleRowAsObjectWithColHeadersAsProps(rowNumberOrHeader) {
        const rowIndex = this.getRowHeaderIndex(rowNumberOrHeader);
        return this.colHeadersOrThrowIfNone().reduce((obj, colHeader, i_col) => {
            obj[colHeader] = this._aoa[rowIndex][i_col];
            return obj;
        }, {});
    }
    getSingleColAsObjectWithRowHeadersAsProps(colNumberOrHeader) {
        const colIndex = this.getColHeaderIndex(colNumberOrHeader);
        return this.rowHeadersOrThrowIfNone().reduce((obj, rowHeader, i_row) => {
            obj[rowHeader] = this._aoa[i_row][colIndex];
            return obj;
        }, {});
    }
    getAsObjectWithRowHeadersAsProps(func) {
        if (this._rowHeaders === "none") {
            throw new Error("Need row headers to get as object");
        }
        return this.aoa().reduce((obj, row, i_row) => {
            const rowHeader = this.rowHeadersOrThrowIfNone()[i_row];
            obj[rowHeader] = func(row, i_row, this);
            return obj;
        }, {});
    }
    getAsNestedObjectWithRowHeadersAsFirstLevelPropsAndColHeadersAsSecondLevelProps() {
        return this.getAsObjectWithRowHeadersAsProps((_, i_row, csv) => {
            return csv.getSingleRowAsObjectWithColHeadersAsProps(i_row + 1);
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    //  ________                                                                              //
    // /        |                                                                             //
    // $$$$$$$$/______   ______   _______    _______   ______    ______    _______   ______   //
    //    $$ | /      \ /      \ /       \  /       | /      \  /      \  /       | /      \  //
    //    $$ |/$$$$$$  |$$$$$$  |$$$$$$$  |/$$$$$$$/ /$$$$$$  |/$$$$$$  |/$$$$$$$/ /$$$$$$  | //
    //    $$ |$$ |  $$/ /    $$ |$$ |  $$ |$$      \ $$ |  $$ |$$ |  $$ |$$      \ $$    $$ | //
    //    $$ |$$ |     /$$$$$$$ |$$ |  $$ | $$$$$$  |$$ |__$$ |$$ \__$$ | $$$$$$  |$$$$$$$$/  //
    //    $$ |$$ |     $$    $$ |$$ |  $$ |/     $$/ $$    $$/ $$    $$/ /     $$/ $$       | //
    //    $$/ $$/       $$$$$$$/ $$/   $$/ $$$$$$$/  $$$$$$$/   $$$$$$/  $$$$$$$/   $$$$$$$/  //
    //                                               $$ |                                     //
    //                                               $$ |                                     //
    //                                               $$/                                      //
    //                                                                                        //
    ////////////////////////////////////////////////////////////////////////////////////////////
    getTransposed(transpose) {
        if (transpose === false) {
            return this.getCopy();
        }
        if (this._aoa.length === 0) {
            throw new Error("CSV has no rows");
        }
        return new Csv({
            aoa: this._aoa[0].map((_, i) => this._aoa.map((row) => row[i])),
            colHeaders: this.rowHeaders(),
            rowHeaders: this.colHeaders(),
        });
    }
    ////////////////////////////////////////////////////////////
    //   ______             __                        __      //
    //  /      \           /  |                      /  |     //
    // /$$$$$$  |  ______  $$ |  ______    _______  _$$ |_    //
    // $$ \__$$/  /      \ $$ | /      \  /       |/ $$   |   //
    // $$      \ /$$$$$$  |$$ |/$$$$$$  |/$$$$$$$/ $$$$$$/    //
    //  $$$$$$  |$$    $$ |$$ |$$    $$ |$$ |        $$ | __  //
    // /  \__$$ |$$$$$$$$/ $$ |$$$$$$$$/ $$ \_____   $$ |/  | //
    // $$    $$/ $$       |$$ |$$       |$$       |  $$  $$/  //
    //  $$$$$$/   $$$$$$$/ $$/  $$$$$$$/  $$$$$$$/    $$$$/   //
    //                                                        //
    ////////////////////////////////////////////////////////////
    getSelectedCols(colsToTake) {
        if (colsToTake === undefined || colsToTake.length === 0) {
            return this.getCopy();
        }
        const colIndexesToTake = this.getColHeaderIndexes(colsToTake);
        colIndexesToTake.forEach((colIndex) => this.validateColIndex(colIndex));
        return new Csv({
            aoa: this._aoa.map((row) => {
                return colIndexesToTake.map((i_col) => row[i_col]);
            }),
            colHeaders: this._colHeaders === "none"
                ? "none"
                : colIndexesToTake.map((i_col) => this._colHeaders[i_col]),
            rowHeaders: this.rowHeaders(),
        });
    }
    getSelectedRows(rowsToTake) {
        if (rowsToTake === undefined || rowsToTake.length === 0) {
            return this.getCopy();
        }
        const rowIndexesToTake = this.getRowHeaderIndexes(rowsToTake);
        rowIndexesToTake.forEach((rowIndex) => this.validateRowIndex(rowIndex));
        return new Csv({
            aoa: rowIndexesToTake.map((i_row) => {
                return this._aoa[i_row].map((cell) => cell);
            }),
            colHeaders: this.colHeaders(),
            rowHeaders: this._rowHeaders === "none"
                ? "none"
                : rowIndexesToTake.map((i_row) => this._rowHeaders[i_row]),
        });
    }
    //////////////////////////////////////////////
    //   ______                         __      //
    //  /      \                       /  |     //
    // /$$$$$$  |  ______    ______   _$$ |_    //
    // $$ \__$$/  /      \  /      \ / $$   |   //
    // $$      \ /$$$$$$  |/$$$$$$  |$$$$$$/    //
    //  $$$$$$  |$$ |  $$ |$$ |  $$/   $$ | __  //
    // /  \__$$ |$$ \__$$ |$$ |        $$ |/  | //
    // $$    $$/ $$    $$/ $$ |        $$  $$/  //
    //  $$$$$$/   $$$$$$/  $$/          $$$$/   //
    //                                          //
    //////////////////////////////////////////////
    getSortedRowsByCol(col, directionOrSortFunc) {
        if (col === undefined) {
            return this.getCopy();
        }
        if (typeof col === "string" && this._colHeaders === "none") {
            throw new Error("Cannot sort by col header if col headers are none");
        }
        const colIndex = this.getHeaderIndex(col, "cols");
        const rowsIndexesToTake = this._aoa.map((_, i_row) => i_row);
        const sortFunc = directionOrSortFunc === undefined || directionOrSortFunc === "descending"
            ? (a, b) => Number(this._aoa[b][colIndex]) - Number(this._aoa[a][colIndex])
            : directionOrSortFunc === "ascending"
                ? (a, b) => Number(this._aoa[a][colIndex]) - Number(this._aoa[b][colIndex])
                : (a, b) => directionOrSortFunc(this._aoa[a][colIndex], this._aoa[b][colIndex]);
        rowsIndexesToTake.sort(sortFunc);
        return this.getSelectedRows(rowsIndexesToTake.map((v) => v + 1));
    }
    getSortedColsByRow(row, directionOrSortFunc) {
        if (row === undefined) {
            return this.getCopy();
        }
        if (typeof row === "string" && this._rowHeaders === "none") {
            throw new Error("Cannot sort by row header if row headers are none");
        }
        const rowIndex = this.getHeaderIndex(row, "rows");
        this.validateRowIndex(rowIndex);
        const colIndexesToTake = this._aoa[0].map((_, i_col) => i_col);
        const sortFunc = directionOrSortFunc === undefined || directionOrSortFunc === "descending"
            ? (a, b) => Number(this._aoa[rowIndex][b]) - Number(this._aoa[rowIndex][a])
            : directionOrSortFunc === "ascending"
                ? (a, b) => Number(this._aoa[rowIndex][a]) - Number(this._aoa[rowIndex][b])
                : (a, b) => directionOrSortFunc(this._aoa[rowIndex][a], this._aoa[rowIndex][b]);
        colIndexesToTake.sort(sortFunc);
        return this.getSelectedCols(colIndexesToTake.map((v) => v + 1));
    }
    ////////////////////////////////////////////////////////
    //   ______                   __                      //
    //  /      \                 /  |                     //
    // /$$$$$$  |  ______    ____$$ |  ______    ______   //
    // $$ |  $$ | /      \  /    $$ | /      \  /      \  //
    // $$ |  $$ |/$$$$$$  |/$$$$$$$ |/$$$$$$  |/$$$$$$  | //
    // $$ |  $$ |$$ |  $$/ $$ |  $$ |$$    $$ |$$ |  $$/  //
    // $$ \__$$ |$$ |      $$ \__$$ |$$$$$$$$/ $$ |       //
    // $$    $$/ $$ |      $$    $$ |$$       |$$ |       //
    //  $$$$$$/  $$/        $$$$$$$/  $$$$$$$/ $$/        //
    //                                                    //
    ////////////////////////////////////////////////////////
    orderCols(colNumbersOrHeaders) {
        const specifiedIndexs = this.getColHeaderIndexes(colNumbersOrHeaders);
        const allColIndexes = createArray(this.nCols());
        const remainingColNumbers = allColIndexes.filter((i) => !specifiedIndexs.includes(i));
        const newNumbers = [...specifiedIndexs, ...remainingColNumbers].map((i) => i + 1);
        return this.getSelectedCols(newNumbers);
    }
    //////////////////////////////////////////////////////////////////////////
    //   ______             __  __                                          //
    //  /      \           /  |/  |                                         //
    // /$$$$$$  |  ______  $$ |$$ |  ______    ______    _______   ______   //
    // $$ |  $$/  /      \ $$ |$$ | /      \  /      \  /       | /      \  //
    // $$ |      /$$$$$$  |$$ |$$ | $$$$$$  |/$$$$$$  |/$$$$$$$/ /$$$$$$  | //
    // $$ |   __ $$ |  $$ |$$ |$$ | /    $$ |$$ |  $$ |$$      \ $$    $$ | //
    // $$ \__/  |$$ \__$$ |$$ |$$ |/$$$$$$$ |$$ |__$$ | $$$$$$  |$$$$$$$$/  //
    // $$    $$/ $$    $$/ $$ |$$ |$$    $$ |$$    $$/ /     $$/ $$       | //
    //  $$$$$$/   $$$$$$/  $$/ $$/  $$$$$$$/ $$$$$$$/  $$$$$$$/   $$$$$$$/  //
    //                                       $$ |                           //
    //                                       $$ |                           //
    //                                       $$/                            //
    //                                                                      //
    //////////////////////////////////////////////////////////////////////////
    collapseAllAsNumbers(reducerFunc) {
        const newRow = [];
        const colHeaders = this.colHeadersOrThrowIfNone();
        colHeaders.forEach((colNumberOrHeader) => {
            const colVals = this.getColVals(colNumberOrHeader);
            const v = reducerFunc(colVals);
            newRow.push(v);
        });
        return new Csv({
            colHeaders,
            rowHeaders: "none",
            aoa: [newRow],
        });
    }
    collapse(stratifierColNumbersOrHeaders, reducerFuncs) {
        const thisCsvColHeaders = this.colHeadersOrThrowIfNone();
        assert(stratifierColNumbersOrHeaders.length <= 2, "Cannot have more than two cols to aggregate by at present");
        assert(this.dataType() === "string", "Must be csv data type string");
        const stratifierColIndexes = this.getColHeaderIndexes(stratifierColNumbersOrHeaders);
        const uniqueStratifierVals = stratifierColIndexes.map((i_col) => {
            return this.getColValsAsUniqueAndSortedArrayOfStrings(i_col + 1);
        });
        const newColHeaders = [];
        newColHeaders.push(...stratifierColIndexes.map((i_col) => thisCsvColHeaders[i_col]));
        reducerFuncs.forEach((rf) => {
            const colIndexes = this.getColHeaderIndexes(rf.colNumbersOrHeaders);
            const colHeaders = colIndexes.map((i_col) => thisCsvColHeaders[i_col]);
            newColHeaders.push(...colHeaders);
        });
        const collapsedCsv = new Csv({
            colHeaders: newColHeaders,
            rowHeaders: "none",
        });
        if (stratifierColIndexes.length === 0) {
            const newRow = [];
            reducerFuncs.forEach((rf) => {
                rf.colNumbersOrHeaders.forEach((colNumberOrHeader) => {
                    const colVals = this.getColVals(colNumberOrHeader);
                    const v = rf.reducerFunc(colVals);
                    newRow.push(v);
                });
            });
            collapsedCsv._aoa.push(newRow);
            collapsedCsv.validate();
            return collapsedCsv;
        }
        if (stratifierColIndexes.length === 1) {
            const indexStrat0 = stratifierColIndexes[0];
            uniqueStratifierVals[0].forEach((strat0) => {
                const filterFunc = (row) => {
                    return row[indexStrat0] === strat0;
                };
                const newRow = [strat0];
                reducerFuncs.forEach((rf) => {
                    rf.colNumbersOrHeaders.forEach((colNumberOrHeader) => {
                        const filteredVals = this.getColValsWithFilter(colNumberOrHeader, filterFunc);
                        const v = rf.reducerFunc(filteredVals);
                        newRow.push(v);
                    });
                });
                collapsedCsv._aoa.push(newRow);
            });
            collapsedCsv.validate();
            return collapsedCsv;
        }
        if (stratifierColIndexes.length === 2) {
            const indexStrat0 = stratifierColIndexes[0];
            const indexStrat1 = stratifierColIndexes[1];
            uniqueStratifierVals[0].forEach((strat0) => {
                uniqueStratifierVals[1].forEach((strat1) => {
                    const filterFunc = (row) => {
                        return row[indexStrat0] === strat0 && row[indexStrat1] === strat1;
                    };
                    const newRow = [strat0, strat1];
                    reducerFuncs.forEach((rf) => {
                        rf.colNumbersOrHeaders.forEach((colNumberOrHeader) => {
                            const filteredVals = this.getColValsWithFilter(colNumberOrHeader, filterFunc);
                            const v = rf.reducerFunc(filteredVals);
                            newRow.push(v);
                        });
                    });
                    collapsedCsv._aoa.push(newRow);
                });
            });
            collapsedCsv.validate();
            return collapsedCsv;
        }
        throw new Error("Should not happen");
    }
    ////////////////////////////////////////
    //     _____            __            //
    //    /     |          /  |           //
    //    $$$$$ |  ______  $$/  _______   //
    //       $$ | /      \ /  |/       \  //
    //  __   $$ |/$$$$$$  |$$ |$$$$$$$  | //
    // /  |  $$ |$$ |  $$ |$$ |$$ |  $$ | //
    // $$ \__$$ |$$ \__$$ |$$ |$$ |  $$ | //
    // $$    $$/ $$    $$/ $$ |$$ |  $$ | //
    //  $$$$$$/   $$$$$$/  $$/ $$/   $$/  //
    //                                    //
    ////////////////////////////////////////
    joinColsWithRowsSameOrder(otherCsv) {
        const otherCsvColHeaders = otherCsv.colHeaders();
        const otherCsvAoa = otherCsv.aoa();
        assert(this.nRows() === otherCsv.nRows(), "Csvs have different number of rows");
        assert(this._colHeaders === "none" || otherCsvColHeaders !== "none", "If first csv has col headers, second csv must also have col headers");
        const newColHeaders = otherCsvColHeaders === "none"
            ? "none"
            : [...this.colHeadersOrThrowIfNone(), ...otherCsvColHeaders];
        const newAoa = this._aoa.map((row, i_row) => {
            return [...row, ...otherCsvAoa[i_row]];
        });
        return new Csv({
            colHeaders: newColHeaders,
            rowHeaders: this._rowHeaders,
            aoa: newAoa,
        });
    }
    joinColsWithMatchedRowHeaders(otherCsv) {
        const otherCsvColHeaders = otherCsv.colHeaders();
        const otherCsvRowHeaders = otherCsv.rowHeaders();
        const otherCsvAoa = otherCsv.aoa();
        assert(this.nRows() === otherCsv.nRows(), "Csvs have different number of rows");
        assert(this._colHeaders === "none" || otherCsvColHeaders !== "none", "If first csv has col headers, second csv must also have col headers");
        assert(this._rowHeaders !== "none" && otherCsvRowHeaders !== "none", "Both csvs must have row headers");
        const newColHeaders = otherCsvColHeaders === "none"
            ? "none"
            : [...this.colHeadersOrThrowIfNone(), ...otherCsvColHeaders];
        const thisCsvRowHeaders = this.rowHeadersOrThrowIfNone();
        const newAoa = this._aoa.map((row, i_row) => {
            const rowHeader = thisCsvRowHeaders[i_row];
            const otherCsvRowIndex = otherCsvRowHeaders.indexOf(rowHeader);
            assert(otherCsvRowIndex >= 0, `Row header in first csv (${rowHeader}) is not in second csv`);
            return [...row, ...otherCsvAoa[otherCsvRowIndex]];
        });
        return new Csv({
            colHeaders: newColHeaders,
            rowHeaders: this._rowHeaders,
            aoa: newAoa,
        });
    }
    joinRowsWithMatchedColHeaders(otherCsv) {
        const otherCsvColHeaders = otherCsv.colHeaders();
        const otherCsvRowHeaders = otherCsv.rowHeaders();
        const otherCsvAoa = otherCsv.aoa();
        assert(this.nCols() === otherCsv.nCols(), "Csvs have different number of cols");
        assert(this._rowHeaders === "none" || otherCsvRowHeaders !== "none", "If first csv has row headers, second csv must also have row headers");
        assert(this._colHeaders !== "none" && otherCsvColHeaders !== "none", "Both csvs must have col headers");
        const newRowHeaders = otherCsvRowHeaders === "none"
            ? "none"
            : [...this.rowHeadersOrThrowIfNone(), ...otherCsvRowHeaders];
        const thisCsvColHeaders = this.colHeadersOrThrowIfNone();
        const otherCsvColIndexes = thisCsvColHeaders.map((colHeader) => {
            const otherCsvColIndex = otherCsvColHeaders.indexOf(colHeader);
            assert(otherCsvColIndex >= 0, `Col header in first csv (${colHeader}) is not in second csv`);
            return otherCsvColIndex;
        });
        const newAoa = [
            ...this._aoa,
            ...otherCsvAoa.map((row) => {
                return otherCsvColIndexes.map((ci) => row[ci]);
            }),
        ];
        return new Csv({
            colHeaders: this._colHeaders,
            rowHeaders: newRowHeaders,
            aoa: newAoa,
        });
    }
    ////////////////////////////////////////////////////////////////////////////
    //  _______                       __                                      //
    // /       \                     /  |                                     //
    // $$$$$$$  |  ______    _______ $$ |____    ______    ______    ______   //
    // $$ |__$$ | /      \  /       |$$      \  /      \  /      \  /      \  //
    // $$    $$< /$$$$$$  |/$$$$$$$/ $$$$$$$  | $$$$$$  |/$$$$$$  |/$$$$$$  | //
    // $$$$$$$  |$$    $$ |$$      \ $$ |  $$ | /    $$ |$$ |  $$ |$$    $$ | //
    // $$ |  $$ |$$$$$$$$/  $$$$$$  |$$ |  $$ |/$$$$$$$ |$$ |__$$ |$$$$$$$$/  //
    // $$ |  $$ |$$       |/     $$/ $$ |  $$ |$$    $$ |$$    $$/ $$       | //
    // $$/   $$/  $$$$$$$/ $$$$$$$/  $$/   $$/  $$$$$$$/ $$$$$$$/   $$$$$$$/  //
    //                                                   $$ |                 //
    //                                                   $$ |                 //
    //                                                   $$/                  //
    //                                                                        //
    ////////////////////////////////////////////////////////////////////////////
    reshapeWide(colNumberOrHeaderFromWhichToCreateCols, colNumberOrHeaderFromWhichToCreateRows, colNumberOrHeaderForVals) {
        assert(this.dataType() === "string", "Must be csv data type of string");
        const colHeaderIndex = this.getColHeaderIndex(colNumberOrHeaderFromWhichToCreateCols);
        const newColHeaders = this.getColValsAsUniqueAndSortedArrayOfStrings(colNumberOrHeaderFromWhichToCreateCols);
        const rowHeaderIndex = this.getColHeaderIndex(colNumberOrHeaderFromWhichToCreateRows);
        const newRowHeaders = this.getColValsAsUniqueAndSortedArrayOfStrings(colNumberOrHeaderFromWhichToCreateRows);
        const valIndex = this.getColHeaderIndex(colNumberOrHeaderForVals);
        const newAoa = newRowHeaders.map((rowHeader) => {
            return newColHeaders.map((colHeader) => {
                const valRow = this._aoa.find((row) => row[rowHeaderIndex] === rowHeader &&
                    row[colHeaderIndex] === colHeader);
                assertNotUndefined(valRow);
                const val = valRow[valIndex];
                assertNotUndefined(val);
                return val;
            });
        });
        return new Csv({
            colHeaders: newColHeaders,
            rowHeaders: newRowHeaders,
            aoa: newAoa,
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  __    __                                            __                __              __                //
    // /  |  /  |                                          /  |              /  |            /  |               //
    // $$ |  $$ | _______    _______   ______    ______   _$$ |_     ______  $$/  _______   _$$ |_    __    __  //
    // $$ |  $$ |/       \  /       | /      \  /      \ / $$   |   /      \ /  |/       \ / $$   |  /  |  /  | //
    // $$ |  $$ |$$$$$$$  |/$$$$$$$/ /$$$$$$  |/$$$$$$  |$$$$$$/    $$$$$$  |$$ |$$$$$$$  |$$$$$$/   $$ |  $$ | //
    // $$ |  $$ |$$ |  $$ |$$ |      $$    $$ |$$ |  $$/   $$ | __  /    $$ |$$ |$$ |  $$ |  $$ | __ $$ |  $$ | //
    // $$ \__$$ |$$ |  $$ |$$ \_____ $$$$$$$$/ $$ |        $$ |/  |/$$$$$$$ |$$ |$$ |  $$ |  $$ |/  |$$ \__$$ | //
    // $$    $$/ $$ |  $$ |$$       |$$       |$$ |        $$  $$/ $$    $$ |$$ |$$ |  $$ |  $$  $$/ $$    $$ | //
    //  $$$$$$/  $$/   $$/  $$$$$$$/  $$$$$$$/ $$/          $$$$/   $$$$$$$/ $$/ $$/   $$/    $$$$/   $$$$$$$ | //
    //                                                                                               /  \__$$ | //
    //                                                                                               $$    $$/  //
    //                                                                                                $$$$$$/   //
    //                                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getWithPointEstimateBounds(from) {
        this.assertNumberCsv();
        if (from === undefined) {
            return this.getCopy();
        }
        if (from === "none") {
            return this.getMappedCells((cell) => {
                return { pe: cell, lb: undefined, ub: undefined };
            });
        }
        if (from === "from-adjacent-cols") {
            assert(this.nRows() > 0, "AoA must have rows");
            const nFinalCols = this.nCols() / 3;
            assert(nFinalCols === Math.round(nFinalCols), "Bad number of cols to take uncertainty bounds. Must be factor of three.");
            return new Csv({
                colHeaders: this._colHeaders === "none"
                    ? "none"
                    : createArray(nFinalCols, (i) => this._colHeaders[i * 3]),
                rowHeaders: this.rowHeaders(),
                aoa: this._aoa.map((row) => {
                    return createArray(nFinalCols, (i) => {
                        const pe = Number(row[i * 3]);
                        const lb = Number(row[i * 3 + 1]);
                        const ub = Number(row[i * 3 + 2]);
                        assert(pe !== undefined && lb !== undefined && ub !== undefined, "Problem with undefined in point estimate bounds");
                        if (pe >= 0 && lb === -1 && ub === -1) {
                            return { pe, lb: undefined, ub: undefined };
                        }
                        if (lb > pe) {
                            console.log("Lower bounds is greater than point estimate");
                            // throw new Error("Lower bounds is greater than point estimate");
                        }
                        if (ub < pe) {
                            console.log("Upper bounds is less than point estimate");
                            // throw new Error("Upper bounds is less than point estimate");
                        }
                        return { pe, lb, ub };
                    });
                }),
            });
        }
        if (from === "from-adjacent-rows") {
            const nFinalRows = this.nRows() / 3;
            assert(nFinalRows === Math.round(nFinalRows), "Bad number of rows to take uncertainty bounds. Must be factor of three.");
            return new Csv({
                colHeaders: this.colHeaders(),
                rowHeaders: this._rowHeaders === "none"
                    ? "none"
                    : createArray(nFinalRows, (i) => this._rowHeaders[i * 3]),
                aoa: createArray(nFinalRows, (i) => {
                    const peRow = this._aoa[i * 3];
                    const lbRow = this._aoa[i * 3 + 1];
                    const ubRow = this._aoa[i * 3 + 2];
                    return peRow.map((cell, i_cell) => {
                        const pe = Number(cell);
                        const lb = Number(lbRow[i_cell]);
                        const ub = Number(ubRow[i_cell]);
                        assert(pe !== undefined && lb !== undefined && ub !== undefined, "Problem with undefined in point estimate bounds");
                        if (pe >= 0 && lb === -1 && ub === -1) {
                            return { pe, lb: undefined, ub: undefined };
                        }
                        if (lb > pe) {
                            console.log("Lower bounds is greater than point estimate");
                            // throw new Error("Lower bounds is greater than point estimate");
                        }
                        if (ub < pe) {
                            console.log("Upper bounds is less than point estimate");
                            // throw new Error("Upper bounds is less than point estimate");
                        }
                        return { pe, lb, ub };
                    });
                }),
            });
        }
        throw new Error("Should not be possible");
    }
    /////////////////////////////////////////////////////
    //  __       __            __    __                //
    // /  |  _  /  |          /  |  /  |               //
    // $$ | / \ $$ |  ______  $$/  _$$ |_     ______   //
    // $$ |/$  \$$ | /      \ /  |/ $$   |   /      \  //
    // $$ /$$$  $$ |/$$$$$$  |$$ |$$$$$$/   /$$$$$$  | //
    // $$ $$/$$ $$ |$$ |  $$/ $$ |  $$ | __ $$    $$ | //
    // $$$$/  $$$$ |$$ |      $$ |  $$ |/  |$$$$$$$$/  //
    // $$$/    $$$ |$$ |      $$ |  $$  $$/ $$       | //
    // $$/      $$/ $$/       $$/    $$$$/   $$$$$$$/  //
    //                                                 //
    /////////////////////////////////////////////////////
    print(nRows) {
        if (nRows === undefined) {
            console.log(this.stringify());
            return;
        }
        console.log(this.getSelectedRows(createArray(nRows, (i) => i + 1)).stringify());
    }
    write(writerFunc) {
        writerFunc(this.stringify());
    }
}
