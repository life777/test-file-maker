import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	test('Sample test', async () => {
		const folders = vscode.workspace.workspaceFolders;
		assert.ok(folders);
		assert.ok(folders.length > 1);

		const tsFiles = await vscode.workspace.fs.readDirectory(folders[0].uri);
		
		console.log(tsFiles);
		await vscode.commands.executeCommand("test-file-maker.createTestFile", vscode.Uri.file(tsFiles[0][0]));

		const newTsFiles = await vscode.workspace.fs.readDirectory(folders[0].uri);

		assert.equal(tsFiles.length + 1, newTsFiles.length);
	});
});
