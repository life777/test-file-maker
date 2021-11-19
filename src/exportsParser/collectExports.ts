import * as vscode from 'vscode';
import { IFileExport } from "./fileExport";
import { findExports } from "./findExports";

export const collectExports = (
    file: vscode.Uri
): Thenable<IFileExport[]> => {
    return vscode.workspace.fs.readFile(file)
        .then(content => findExports(
            "",
            Buffer.from(content).toString("utf-8")
        ))
        .then(undefined, () => []);
};