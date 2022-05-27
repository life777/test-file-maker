import * as vscode from 'vscode';

export interface ITerminalFactory {
    createTerminal(): vscode.Terminal;
}

export class TerminalFactory {
    private terminal: vscode.Terminal | undefined;

    constructor (
        private readonly title: string
    ) {}

    public createTerminal(): vscode.Terminal {
        if (this.terminal && this.terminal.exitStatus === undefined) {
            return this.terminal;
        }

        if (this.terminal !== undefined) {
            this.terminal.dispose();
            this.terminal = undefined;
        }

        this.terminal = vscode.window.createTerminal(this.title);
        return this.terminal;
    }
}