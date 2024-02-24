import { IFileExport } from "../../exportsParser/fileExport";

export const stringifyExports = (moduleName: string, exports: IFileExport[]): string => {
    let { defaultExports, namedExports } = groupExports(exports);

    let defaultExportName = defaultExports.length > 0 ? defaultExports[0] || moduleName : "";
    let namedExportNames = namedExports.length > 0 ? `{ ${namedExports.join(", ")} }` : "";
    return [defaultExportName, namedExportNames].filter((s) => s).join(", ");
};

const groupExports = (exports: IFileExport[]): { defaultExports: string[]; namedExports: string[] } => {
    return exports
        .filter((export1, index, exports) => exports.findIndex((export2) => export1.name === export2.name) === index)
        .reduce(
            (acc, export1) => {
                // group by default
                if (export1.isDefault) {
                    acc.defaultExports.push(export1.name);
                } else {
                    acc.namedExports.push(export1.name);
                }

                return acc;
            },
            {
                defaultExports: [] as string[],
                namedExports: [] as string[]
            }
        );
};
