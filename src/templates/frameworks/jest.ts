export const createJestTestFilePattern = (fileName: string, modules: string[]) => `

describe("Test for ${ fileName }", () => {
${ modules.map(createTest).join("") }
});`.trim();

const createTest = (module: string) => `
    test("Test ${ module }", () => {
        expect(true).toBeTruthy();
    });
`;

export const runJestWatcher = (path: string, addWatcher: boolean) => {
    return `jest ${ path } ${ addWatcher ? "--watch" : "" }`;
};