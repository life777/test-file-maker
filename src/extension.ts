import * as vscode from "vscode";
import { parse } from "path";
import { matchFileToWorkspaceFolder } from "./workspace/pickWorkspace";
import { createTestFilePath } from "./workspace/createTestFilePath";
import { getTestFileSettings } from "./workspace/getTestFileSettings";
import { createTestFileContent } from "./workspace/testFileContent/createTestFileContent";
import { ImportType } from "./workspace/testFileContent/importType";
import { getCurrentFile } from "./workspace/getCurrentFileUri";
import { runTests } from "./testsRunner/runTests";
import { TerminalFactory } from "./workspace/terminal";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("test-file-maker.createTestFile", (f) => {
        let file = getCurrentFile(f);

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

        let testFile = vscode.Uri.file(testFilePath);
        vscode.workspace.fs
            .stat(testFile)
            .then(undefined, () => {
                return createTestFileContent(
                    file as vscode.Uri,
                    testFile,
                    fileName.name,
                    settings.get<string>("testFramework") || "none",
                    settings.get<ImportType>("importFileExports") || ImportType.none
                ).then((contentStr) =>
                    vscode.workspace.fs.writeFile(testFile, new Uint8Array(Buffer.from(contentStr, "utf-8")))
                );
            })
            .then(() => vscode.window.showTextDocument(testFile));
    });

    context.subscriptions.push(disposable);

    let testTerminalFactory = new TerminalFactory("Run tests");
    let disposable2 = vscode.commands.registerCommand("test-file-maker.startTestsWatcher", (f) => {
        runTests(f, true, testTerminalFactory);
    });

    let disposable3 = vscode.commands.registerCommand("test-file-maker.runTests", (f) => {
        runTests(f, false, testTerminalFactory);
    });

    context.subscriptions.push(disposable2);
    context.subscriptions.push(disposable3);
}

export function deactivate() {}
