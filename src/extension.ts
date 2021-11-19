import * as vscode from 'vscode';
import { parse } from "path";
import { createTemplate } from './templates/templatesFactory';
import { matchFileToWorkspaceFolder } from './workspace/pickWorkspace';
import { createTestFilePath } from './workspace/createTestFilePath';
import { getTestFileSettings } from './workspace/getTestFileSettings';
import { createTestFileContent } from './workspace/testFileContent/createTestFileContent';
import { ImportType } from './workspace/testFileContent/importType';

const getFileToCreateTestFor = (file: vscode.Uri | undefined): vscode.Uri | undefined => {
    if (file) {
        return file;
    }

    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        return activeTextEditor.document.uri;
    }

    return undefined;
};

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("test-file-maker.createTestFile", f => {
        let file = getFileToCreateTestFor(f);

        if (!file) {
            vscode.window.showErrorMessage("No file selected");
            return;
        }

        let workspaceRoot = matchFileToWorkspaceFolder(vscode.workspace.workspaceFolders || [], file.fsPath);
        if (!workspaceRoot) {
            vscode.window.showErrorMessage("No workspace folder found for the file");
            return;
        }

        const settings = vscode.workspace.getConfiguration("testFileMaker");
        let fileName = parse(file.fsPath);
        let testFilePath = createTestFilePath(file, workspaceRoot, getTestFileSettings(settings));

        if (!testFilePath.startsWith(workspaceRoot)) {
            vscode.window.showErrorMessage("Test file path is not within the workspace");
            return;
        }

        settings.get<boolean>("importFileExports");
        let testFile = vscode.Uri.file(testFilePath);
        vscode.workspace.fs.stat(testFile)
            .then(undefined, () => {
                return createTestFileContent(
                    file as vscode.Uri,
                    testFile,
                    fileName.name,
                    settings.get<string>("testFramework") || "none",
                    settings.get<ImportType>("importFileExports") || ImportType.none
                )
                .then(contentStr => vscode.workspace.fs.writeFile(
                    testFile,
                    new Uint8Array(Buffer.from(contentStr, "utf-8"))
                ));
            })
            .then(() => vscode.window.showTextDocument(testFile));
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
