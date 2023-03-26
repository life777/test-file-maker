import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		// await runTests({ extensionDevelopmentPath, extensionTestsPath });

		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const integrationProjestTests = path.resolve(__dirname, './test-fixture/fixture-file-creation');

		// The path to test runner
		// Passed to --extensionTestsPath
		const integrationTests = path.resolve(__dirname, './integration-suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath: integrationProjestTests, extensionTestsPath: integrationTests });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
