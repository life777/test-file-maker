export const createQUnitTestFilePattern = (fileName: string, modules: string[]) =>
    `
QUnit.module("Test for ${fileName}", () => {
    ${modules.map(createTest).join("\n\n")}
});
`.trim();

const createTest = (module: string) =>
    `
QUnit.test("Test ${module}", assert => {
    assert.ok(true);
});
`.trim();
