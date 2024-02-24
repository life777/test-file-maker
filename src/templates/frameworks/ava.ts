export const createAvaTestFilePattern = (fileName: string, modules: string[]) =>
    `
// Test for ${fileName}
${modules.map(createTest).join("\n\n")}
`.trim();

const createTest = (module: string) =>
    `
test("Test ${module}", t => {
    t.true(true);
    t.pass();
});
`.trim();

export const runAvaWatcher = (path: string, pathToConfig: string, addWatcher: boolean) => {
    let args = [pathToConfig ? `--config ${pathToConfig}` : "", addWatcher ? "--watch" : ""].filter((s) => s);

    return `ava ${path} ${args.join(" ")}`;
};
