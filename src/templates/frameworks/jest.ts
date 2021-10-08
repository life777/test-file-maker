export const createJestTestFilePattern = (fileName: string, modules: string[]) => `
describe("Test for ${ fileName }", () => {
    ${ modules.map(createTest).join('\n\n') }
});
`.trim();

const createTest = (module: string) => `
    test("Test ${ module }", () => {
        expect(true).toBeTruthy();
    });
`.trim();