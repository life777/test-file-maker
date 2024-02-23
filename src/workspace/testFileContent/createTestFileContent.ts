import * as vscode from "vscode";
import { collectExports } from "../../exportsParser/collectExports";
import { createTemplate } from "../../templates/templatesFactory";
import { createImportLine } from "./buildImportLine";
import { createRelativePathFromFileToFile } from "./createRelativePathFromFileToFile";
import { ImportType } from "./importType";

export const createTestFileContent = (
    filePath: vscode.Uri,
    testFilePath: vscode.Uri,
    fileName: string,
    testFramework: string,
    importType: ImportType
): Thenable<string> => {
    if (importType === ImportType.none) {
        return Promise.resolve(createTemplate(testFramework, [], fileName));
    }

    return collectExports(filePath).then((exports) => {
        let content = createTemplate(
            testFramework,
            exports.filter((e) => e.name !== "").map((e) => e.name),
            fileName
        );
        let importLine = createImportLine(
            fileName,
            createRelativePathFromFileToFile(testFilePath, filePath),
            exports,
            importType
        );
        return `${importLine}\n${content}`;
    });
};
