export const createTapeTestFilePattern = (fileName: string, modules: string[]) =>
    `
// Test for ${fileName}
${modules.map(createTest).join("\n\n")}
`.trim();

const createTest = (module: string) =>
    `
test("Test ${module}", t => {
    t.ok(true);
});
`.trim();
