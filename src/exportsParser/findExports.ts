import * as ts from "typescript";
import { IFileExport } from "./fileExport";

const createExport = (
    name: string,
    isDefault = false
): IFileExport => ({
    name,
    isDefault
});

export const findExports = (
    fileName: string,
    content: string
): IFileExport[] => {
    const ast = ts.createSourceFile(
        fileName,
        content,
        ts.ScriptTarget.ES2015
    );

    const exports: IFileExport[] = [];
    ts.forEachChild(ast, node => {
        exports.push(...parseExport(node));
    });
    return exports;
};

const parseExport = (
    node: ts.Node
): IFileExport[] => {
    switch (node.kind) {
        case ts.SyntaxKind.ExportDeclaration:
            return parseExportDeclaration(node as ts.ExportDeclaration);
        case ts.SyntaxKind.ExportAssignment:
            return parseExportAssignment(node as ts.ExportAssignment);
        case ts.SyntaxKind.ExportSpecifier:
            return parseExportSpecifier(node as ts.ExportSpecifier);
        case ts.SyntaxKind.VariableStatement:
            return parseVariableStatement(node as ts.VariableStatement);
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ClassDeclaration:
            return parseFunctionClassDeclaration(node as ts.FunctionDeclaration | ts.ClassDeclaration);
        default:
            return [];
    }
};

const checkModifier = (
    node: ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement,
    type: ts.SyntaxKind
): boolean => {
    if (!node.modifiers) {
        return false;
    }

    return node.modifiers.some(modifier => modifier.kind === type);
};

const checkExportModifier = (
    node: ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement
): boolean => checkModifier(node, ts.SyntaxKind.ExportKeyword);

const checkDefaultExport = (
    node: ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement
): boolean => checkModifier(node, ts.SyntaxKind.DefaultKeyword);

const parseFunctionClassDeclaration = (
    node: ts.FunctionDeclaration | ts.ClassDeclaration
): IFileExport[] => {
    if (!checkExportModifier(node)) {
        return [];
    }

    let isDefault = checkDefaultExport(node);
    let fnName = node.name ? node.name.escapedText.toString() : "";
    return [ createExport(fnName, isDefault) ];
};

const parseVariableStatement = (
    node: ts.VariableStatement
): IFileExport[] => {
    if (!checkExportModifier(node)) {
        return [];
    }
    
    let isDefault = checkDefaultExport(node);
    return node.declarationList.declarations.map(declaration => {
        let identifier = declaration.name as ts.Identifier;
        return createExport(identifier.escapedText.toString(), isDefault);
    });
};

const parseExportAssignment = (
    exportAssignment: ts.ExportAssignment
): IFileExport[] => {
    if (exportAssignment.isExportEquals) {
        return [];
    }

    if (exportAssignment.expression.kind === ts.SyntaxKind.Identifier) {
        const identifier = exportAssignment.expression as ts.Identifier;
        return [
            createExport(identifier.escapedText.toString(), true)
        ];
    }

    return [
        createExport("", true)
    ];
};

const parseExportSpecifier = (
    exportSpecifier: ts.ExportSpecifier
): IFileExport[] => {
    return [
        createExport(exportSpecifier.name.escapedText.toString())
    ];
};

const parseExportDeclaration = (
    exportDeclaration: ts.ExportDeclaration
): IFileExport[] => {
    const exportClause = exportDeclaration.exportClause;
    if (!exportClause) {
        return [];
    }
    
    if (exportClause.kind === ts.SyntaxKind.NamespaceExport) {
        const namespaceExport = exportClause as ts.NamespaceExport;
        return [ createExport(namespaceExport.name.escapedText.toString()) ];
    }
    
    if (exportClause.kind === ts.SyntaxKind.NamedExports) {
        const namedExports = exportClause as ts.NamedExports;
        return namedExports.elements.map(element => {
            return element.name.escapedText.toString();
        }).map(name => createExport(name));
    }

    return [];
};