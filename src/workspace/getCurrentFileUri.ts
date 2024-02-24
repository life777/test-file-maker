import * as vscode from "vscode";

export const getCurrentFile = (file: vscode.Uri | undefined): vscode.Uri | undefined => {
    if (file) {
        return file;
    }

    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        return activeTextEditor.document.uri;
    }

    return undefined;
};
