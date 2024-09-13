import { Csv } from "./deps";
import { saveAs } from "./file_saver";
export function downloadCsv(csv, filename) {
    var blob = new Blob([csv instanceof Csv ? csv.stringify() : csv], {
        type: "text/plain;charset=utf-8",
    });
    saveAs(blob, filename ?? "data.csv");
}
export function downloadJson(json, filename) {
    var blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json;charset=utf-8",
    });
    saveAs(blob, filename ?? "data.json");
}
