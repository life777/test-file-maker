import { join, parse, ParsedPath } from "path";
import * as vscode from "vscode";
import { ITestFileSettings } from "./getTestFileSettings";

const fileNamePlaceholder = "{FileName}";
const fileExtPlaceholder = "{FileNameExtention}";
const filePathPlaceholder = "{FilePath}";
const filePathRootPlaceholder = "{FilePathFromRoot}";

export const createTestFilePath = (file: vscode.Uri, workspaceRoot: string, settings: ITestFileSettings): string => {
    let fileName = parse(file.fsPath);
    let testFileDir = createTestFileDir(fileName, workspaceRoot, settings);
    let testFileName = createTestFileName(fileName, settings);

    return join(workspaceRoot, testFileDir, testFileName);
};

const createTestFileName = (file: ParsedPath, settings: ITestFileSettings): string => {
    let fileNamePattern = settings.fileNamePattern || `test${file.ext}`;
    return fileNamePattern.replace(fileNamePlaceholder, file.name).replace(fileExtPlaceholder, file.ext);
};

const createTestFileDir = (file: ParsedPath, workspaceRoot: string, settings: ITestFileSettings): string => {
    let relativeCurrentFilePath = file.dir.replace(workspaceRoot, ".");
    let currentFilePathRoot = settings.currentFileRootPath || "";
    let currentFilePart = relativeCurrentFilePath.startsWith(currentFilePathRoot)
        ? relativeCurrentFilePath.substring(currentFilePathRoot.length)
        : relativeCurrentFilePath;

    return (settings.filePathPattern || filePathPlaceholder)
        .replace(filePathPlaceholder, relativeCurrentFilePath)
        .replace(filePathRootPlaceholder, currentFilePart);
};
