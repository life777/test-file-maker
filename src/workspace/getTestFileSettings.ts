import * as vscode from "vscode";

export const getTestFileSettings = (config: vscode.WorkspaceConfiguration): ITestFileSettings => {
    return {
        fileNamePattern: config.get("testFileName") || "",
        filePathPattern: config.get("testFilePath") || "",
        currentFileRootPath: config.get("currentFilePathRoot") || ""
    };
};

export interface ITestFileSettings {
    fileNamePattern: string;
    filePathPattern: string;
    currentFileRootPath: string;
}
