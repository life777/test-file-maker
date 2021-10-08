import * as vscode from 'vscode';
import { parse, join } from "path";
import { createTemplate } from './templates/templatesFactory';
import { matchFileToWorkspaceFolder } from './workspace/pickWorkspace';
import { createTestFilePath } from './workspace/createTestFilePath';
import { getTestFileSettings } from './workspace/getTestFileSettings';

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

        vscode.workspace.fs.stat(vscode.Uri.file(testFilePath))
            .then(undefined, () => {
                let testFramework = settings.get<string>("testFramework") || "none";
                let content = new Uint8Array(Buffer.from(createTemplate(testFramework, [], fileName.name)));
                return vscode.workspace.fs.writeFile(vscode.Uri.file(testFilePath), content);
            })
            .then(() => {
                return vscode.window.showTextDocument(vscode.Uri.file(testFilePath));
            });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
