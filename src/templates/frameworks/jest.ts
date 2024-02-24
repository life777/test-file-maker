export const createJestTestFilePattern = (fileName: string, modules: string[]) =>
    `

describe("Test for ${fileName}", () => {
${modules.map(createTest).join("")}
});`.trim();

const createTest = (module: string) => `
    test("Test ${module}", () => {
        expect(true).toBeTruthy();
    });
`;

export const runJestWatcher = (path: string, pathToConfig: string, addWatcher: boolean) => {
    let args = [pathToConfig ? `--config ${pathToConfig}` : "", addWatcher ? "--watch" : ""].filter((s) => s);

    return `jest ${path} ${args.join(" ")}`;
};
