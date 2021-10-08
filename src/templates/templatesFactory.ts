import { createAvaTestFilePattern } from "./frameworks/ava";
import { createJasmineTestFilePattern } from "./frameworks/jasmine";
import { createJestTestFilePattern } from "./frameworks/jest";
import { createMochaTestFilePattern } from "./frameworks/mocha";
import { createNoneTestFilePattern } from "./frameworks/none";
import { createQUnitTestFilePattern } from "./frameworks/qunit";
import { createTapeTestFilePattern } from "./frameworks/tape";

type TemplateFn = {
    [frameworkName: string]: (fileName: string, modules: string[]) => string
};

const hash: TemplateFn = {
    "jest": createJestTestFilePattern,
    "qunit": createQUnitTestFilePattern,
    "none": createNoneTestFilePattern,
    "jasmine": createJasmineTestFilePattern,
    "ava": createAvaTestFilePattern,
    "mocha": createMochaTestFilePattern,
    "tape": createTapeTestFilePattern
};

export const createTemplate = (
    frameworkName: string,
    modules: string[],
    fileName: string
) => {
    const template = hash[frameworkName] || hash["none"];
    return template(
        fileName,
        modules.length > 0 ? modules : [fileName]
    );
};