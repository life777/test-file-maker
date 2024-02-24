export const createUvuTestFilePattern = (fileName: string, modules: string[]) =>
    `
import { suite } from "uvu";
import { assert } from "uvu/assert";

const newSuite = suite("Test for ${fileName}");

${modules.map(createTest).join("\n\n")}

newSuite.run();
`.trim();

const createTest = (module: string) =>
    `
newSuite("Test ${module}", () => {
    assert.ok(true);
});
`.trim();
