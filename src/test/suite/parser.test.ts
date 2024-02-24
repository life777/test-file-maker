import * as assert from "assert";
import { findExports } from "../../exportsParser/findExports";

const testExports = [
    ["export const hello = () => {};", ["hello"], false],
    ["export const hello = () => {}, world = () => {};", ["hello", "world"], false],
    ["export function func () {}", ["func"], false],
    ["export class Foo {}", ["Foo"], false],
    ["export default {}", [""], true],
    ["export default 'asd'", [""], true],
    ["export default class Render {}", ["Render"], true]
] as [string, string[], boolean][];

suite("Export parser", () => {
    for (const [code, expected, hasDefault] of testExports) {
        test(`Collect exports ${code}`, async () => {
            const actual = await findExports("MainFunction", code);
            assert.deepStrictEqual(
                actual.map((ex) => ex.name),
                expected
            );

            assert.strictEqual(
                actual.some((ex) => ex.isDefault),
                hasDefault
            );
        });
    }
});
