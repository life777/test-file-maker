import * as path from "path";
import { IFileExport } from "../../exportsParser/fileExport";
import { ImportType } from "./importType";
import { stringifyExports } from "./stringifyExports";

export const createImportLine = (
    fileName: string,
    filePath: string,
    exports: IFileExport[],
    importType: ImportType
): string => {
    if (exports.length === 0 || importType === ImportType.none) {
        return "";
    }

    let { dir, name } = path.parse(filePath);
    return `import ${ createImportPart(fileName, exports, importType) } from "${ path.join(dir, name) }";`;
};

const createImportPart = (
    fileName: string,
    exports: IFileExport[],
    importType: ImportType
): string => {
    if (importType === ImportType.individual) {
        return createIndividualImportLine(fileName, exports);
    }

    return createGroupedImportLine(fileName);
};


const createIndividualImportLine = (
    fileName: string,
    exports: IFileExport[]
): string => {
    return stringifyExports(fileName, exports);
};

const createGroupedImportLine = (
    fileName: string
): string => {
    return ` * as ${ fileName }`;
};