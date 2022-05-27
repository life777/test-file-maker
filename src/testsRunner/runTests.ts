import * as vscode from 'vscode';
import { extname } from "path";
import { matchFileToWorkspaceFolder } from '../workspace/pickWorkspace';
import { createCommandToRunFrameworkTests } from '../templates/templatesFactory';
import { getCurrentFile } from '../workspace/getCurrentFileUri';
import { ITerminalFactory } from '../workspace/terminal';

export const runTests = async (
    f: vscode.Uri | undefined,
    addWatcher: boolean,
    terminalFactory: ITerminalFactory
) => {
    let file = getCurrentFile(f);

    if (!file) {
        vscode.window.showErrorMessage("No path selected to watch");
        return;
    }

    let workspaceRoot = matchFileToWorkspaceFolder(vscode.workspace.workspaceFolders || [], file.fsPath);
    if (!workspaceRoot) {
        vscode.window.showErrorMessage("No workspace folder found for the file");
        return;
    }

    const settings = vscode.workspace.getConfiguration("testFileMaker");
    const framework = settings.get<string>("testFramework") || "none";
    const testFileExt = settings.get<string>("startingTestWatcherFileExtension") || "don't change";
    const fileExt = extname(file.fsPath);
    const filePath = fileExt !== "" && testFileExt !== "don't change" ? file.fsPath.replace(fileExt, testFileExt) : file.fsPath;
    const relativeFilePath = filePath.replace(workspaceRoot, ".");
    const watcherCommand = createCommandToRunFrameworkTests(framework, relativeFilePath, addWatcher);

    if (watcherCommand === "") {
        vscode.window.showErrorMessage("Your test framework does not support watching");
        return;
    }

    const testsTerminal = terminalFactory.createTerminal();
    testsTerminal.show();

    // stop currently running tests in terminal
    await vscode.commands.executeCommand("workbench.action.terminal.sendSequence", { text : "\x03" });

    testsTerminal.sendText(`npx ${ watcherCommand }`);
    return testsTerminal;
};