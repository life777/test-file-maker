import * as path from 'path';
import * as vscode from 'vscode';

export const createRelativePathFromFileToFile = (
    file: vscode.Uri,
    fileTo: vscode.Uri
): string => {
    return path.relative(
        path.dirname(file.fsPath),
        fileTo.fsPath
    );
};