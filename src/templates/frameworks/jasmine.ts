export const createJasmineTestFilePattern = (fileName: string, modules: string[]) => `
describe("Test for ${ fileName }", () => {
    ${ modules.map(createTest).join('\n\n') }
});
`.trim();

const createTest = (module: string) => `
it("Test ${ module }", () => {
    expect(true).toBe(true);
});
`.trim();