export const createMochaTestFilePattern = (fileName: string, modules: string[]) =>
    `
import * as assert from "assert";

describe("Test for ${fileName}", () => {
    ${modules.map(createTest).join("\n\n")}
});
`.trim();

const createTest = (module: string) =>
    `
it("Test ${module}", () => {
    assert.ok(true);
});
`.trim();
