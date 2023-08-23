# Test file maker for Visual Studio Code

Test file maker is a simple extension that allows you quickly create files for tests for your TypaScript and JavaScript modules, classes and functions. All you need is specify a folder where you want to create test files and test framework. This extension will add a new option in you context menu that will create a test file.

## Settings

#### `testFileMaker.testFramework` (default `none`)

Specify a test framework that you use.

#### `testFileMaker.testFileName` (default `{FileName}Test{FileNameExtention}`)

Specify what name should new test file have. You can use `{FileName}` and `{FileNameExtention}` placeholders that will be replaced with current file name and extension.

For `my-component.js` this will create `my-component.Test.js`

#### `testFileMaker.currentFilePathRoot` (default `""`)

Specify root directory for your Typescript and Javascript files.

#### `testFileMaker.testFilePath` (default `./tests`)

Specify directory where new test files should be created. You can use `{FilePathFromRoot}` placeholders to add a nested directory to the path.

Example:
- your component is: `./src/components/my-component.js`
- you want the test file: `./specs/components/my-component.spec.js`
- use this setting: `"testFileMaker.testFilePath": "./specs{FilePathFromRoot}"`

#### `testFileMaker.importFileExports` (default `individual`)

Specify how exports of testing file should be imported.

#### `testFileMaker.startingTestWatcherFileExtension` (default `don't change`)

Specify file extentions in your project to run tests with single command. By default, it runs tests with the same extension as the file you are editing.

#### `testFileMaker.pathToTestFrameworkConfig` (default ``)

Specifies path to a test framework config file. By default, it searches for a config file in your project workspace.
