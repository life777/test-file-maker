import { createAvaTestFilePattern, runAvaWatcher } from "./frameworks/ava";
import { createJasmineTestFilePattern } from "./frameworks/jasmine";
import { createJestTestFilePattern, runJestWatcher } from "./frameworks/jest";
import { createMochaTestFilePattern } from "./frameworks/mocha";
import { createNoneTestFilePattern } from "./frameworks/none";
import { createQUnitTestFilePattern } from "./frameworks/qunit";
import { createTapeTestFilePattern } from "./frameworks/tape";
import { createUvuTestFilePattern } from "./frameworks/uvu";

interface IFrameworkSettings {
    createTemplate: (fileName: string, modules: string[]) => string;
    runTests?: (path: string, pathToConfig: string, watcher: boolean) => string;
    configFileName?: string;
}

type TemplateFn = {
    [frameworkName: string]: IFrameworkSettings;
};

const hash: TemplateFn = {
    jest: { createTemplate: createJestTestFilePattern, runTests: runJestWatcher, configFileName: "jest.config.*" },
    qunit: { createTemplate: createQUnitTestFilePattern },
    none: { createTemplate: createNoneTestFilePattern },
    jasmine: { createTemplate: createJasmineTestFilePattern },
    ava: { createTemplate: createAvaTestFilePattern, runTests: runAvaWatcher, configFileName: "ava.config.*" },
    mocha: { createTemplate: createMochaTestFilePattern },
    tape: { createTemplate: createTapeTestFilePattern },
    uvu: { createTemplate: createUvuTestFilePattern }
};

export const createTemplate = (frameworkName: string, modules: string[], fileName: string) => {
    const { createTemplate } = hash[frameworkName] || hash["none"];
    return createTemplate(fileName, modules.length > 0 ? modules : [fileName]);
};

export const getFrameworkSettings = (frameworkName: string): Required<IFrameworkSettings> => {
    return {
        configFileName: "",
        runTests: () => "",
        ...(hash[frameworkName] || hash["none"])
    };
};
