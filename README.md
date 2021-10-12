# Test file maker for Visual Studio Code

Test file maker is a simple extension that allows you quickly create files for tests for your TypaScript and JavaScript modules, classes and functions. All you need is specify a folder where you want to create test files and test framework. This extension will add a new option in you context menu that will create a test file.

## Settings

#### testFileMaker.testFramework (default `none`)

Specify a test framework that you use.

#### testFileMaker.testFileName (default `{FileName}Test{FileNameExtention}`)

Specify what name should new test file have. You can use `{FileName}` and `{FileNameExtention}` placeholders that will be replaced with current file name and extension.

#### testFileMaker.currentFilePathRoot (default `""`)

Specify root directory for your Typescript and Javascript files.

#### testFileMaker.testFilePath (default `./tests`)

Specify directory where new test files should be created.