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

    const { dir, name } = path.parse(filePath);
    // if dir is empty the test file is in the same directory
    const importPath = dir.trim() === "" ? `.${ path.sep }${ name }` : path.join(dir, name) 
    return `import ${ createImportPart(fileName, exports, importType) } from "${ importPath }";`;
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
    return ` * as ${ formatVariableName(fileName) }`;
};

const DEFAULT_GROUPPED_VARIABLE_NAME = "jsModule";

const formatVariableName = (fileName: string) => {
    return fileName.split(/[^a-z]/ig)
        .filter(s => s.trim().length > 0)
        .map((s, i) => i !== 0 ? `${s[0].toLocaleUpperCase()}${ s.slice(1).toLocaleLowerCase() }` : s.toLocaleLowerCase())
        .join("") || DEFAULT_GROUPPED_VARIABLE_NAME;
};