import * as assert from 'assert';
import * as path from 'path';
import { TextEncoder } from 'util';
import * as vscode from 'vscode';

suite('Create test file test', () => {
	test('Create simple file', async () => {
		const folders = vscode.workspace.workspaceFolders;

		assert.ok(folders);
		assert.ok(folders.length > 0);
		let folder = folders[0];

		let dir = vscode.Uri.file(path.join(folder.uri.fsPath, "src"));
		await vscode.workspace.fs.createDirectory(dir);

		let file = vscode.Uri.file(path.join(dir.fsPath, "sometest.js"));
		let encoder = new TextEncoder();
		await vscode.workspace.fs.writeFile(file, encoder.encode(`
			export const fn = () => {};
		`));
		
		try {
			await vscode.commands.executeCommand("test-file-maker.createTestFile", file);

			const newTsFiles = await vscode.workspace.fs.readDirectory(dir);

			assert.equal(newTsFiles.length, 2);
		} finally {
			vscode.workspace.fs.delete(dir, { recursive: true });
		}
	});
});
