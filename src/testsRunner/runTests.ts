import * as vscode from 'vscode';
import { extname, join } from "path";
import { matchFileToWorkspaceFolder } from '../workspace/pickWorkspace';
import { getFrameworkSettings } from '../templates/templatesFactory';
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
        return "";
    }

    const settings = vscode.workspace.getConfiguration("testFileMaker");
    const framework = settings.get<string>("testFramework") || "none";
    const testFileExt = settings.get<string>("startingTestWatcherFileExtension") || "don't change";
    const fileExt = extname(file.fsPath);
    const filePath = fileExt !== "" && testFileExt !== "don't change" ? file.fsPath.replace(fileExt, testFileExt) : file.fsPath;
    const frameworkSettings = getFrameworkSettings(framework);
    const pathToConfig = await getPathToConfig(workspaceRoot, frameworkSettings.configFileName);
    const relativeFilePath = filePath.replace(workspaceRoot, ".");
    const watcherCommand = frameworkSettings.runTests(relativeFilePath, pathToConfig, addWatcher);

    if (watcherCommand === "") {
        vscode.window.showErrorMessage("Your test framework does not support running tests with this extension. Could you create an issue on github?");
        return;
    }

    const testsTerminal = terminalFactory.createTerminal();
    testsTerminal.show(false);

    // we should wait until the terminal is focused
    await testsTerminal.processId;

    // stop currently running tests in terminal
    await vscode.commands.executeCommand("workbench.action.terminal.sendSequence", { text : "\x03" });

    testsTerminal.sendText(`npx ${ watcherCommand }`);
    return testsTerminal;
};

const getPathToConfig = async (workspaceRoot: string, configFileName: string) => {
    const settings = vscode.workspace.getConfiguration("testFileMaker");

    let root = settings.get<string>("pathToTestFrameworkConfig") || "";

    // if the user has not specified a path to the config file, we will try to find it in the workspace
    if (root === "") {
        root = await findConfigFile(workspaceRoot, configFileName);
    }

    let testsFolder = join(workspaceRoot, root);
    if (!testsFolder.startsWith(workspaceRoot)) {
        vscode.window.showErrorMessage("Test root folder is not within the workspace");
        return "";
    }

    return testsFolder.replace(workspaceRoot, ".");
};

let foundConfigFile = "";
const findConfigFile = async (workspaceRoot: string, configFileName: string) => {
    if (foundConfigFile !== "" || configFileName === "") {
        return foundConfigFile;
    }

    let files = await vscode.workspace.findFiles(`**/${ configFileName }`, `node_modules/**`, 1);

    if (files.length > 0) {
        foundConfigFile = files[0].fsPath.replace(workspaceRoot, ".");
    }

    return foundConfigFile;
};