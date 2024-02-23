import * as vscode from "vscode";

export const matchFileToWorkspaceFolder = (
    workspaceFolders: readonly vscode.WorkspaceFolder[],
    fileName: string
): string | undefined => {
    let folders = workspaceFolders.filter((f) => fileName.startsWith(f.uri.fsPath));
    if (folders.length === 0) {
        return undefined;
    }

    let folder = folders[0];
    return folder.uri.fsPath;
};
