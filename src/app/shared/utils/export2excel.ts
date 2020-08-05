import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

export function export2excel(fileName: string, sheetName: string, rowData: any[]) {
    const wb: XLSX.WorkBook = {
        Sheets: {},
        Props: {},
        SheetNames: [sheetName]
    };

    wb.Sheets[sheetName] = XLSX.utils.json_to_sheet(rowData);

    const wopts: XLSX.WritingOptions = {
        bookType: 'xlsx',
        bookSST: false,
        type: "binary"
    };
    const excelBuffer = XLSX.write(wb, wopts);
    const data: Blob = new Blob([s2ab(excelBuffer) as any], {
        type: 'application/octet-stream'
    });
    FileSaver.saveAs(data, fileName);
}

function s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;

        }
        return buf;
    } else {
        const buf = new Array(s.length);
        for (let i = 0; i != s.length; i++) {
            buf[i] = s.charCodeAt(i) & 0xff;

        }
        return buf;
    }
}
