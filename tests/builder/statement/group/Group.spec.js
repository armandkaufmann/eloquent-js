import {describe, expect, test} from 'vitest';
import GroupBy from "../../../../src/builder/statement/group/GroupBy.js";

describe('Statement: Group', () => {
    describe('toString', () => {
        test("it builds a partial statement", () => {
            const column = 'name';
            const expectedResult = "`name`";

            const result = new GroupBy(column).toString();

            expect(result).toEqual(expectedResult);
        });

        test("it builds a partial statement with separator", () => {
            const column = 'name';
            const expectedResult = ", `name`";

            const result = new GroupBy(column).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'name';
            const expectedResult = "`name`";

            const result = new GroupBy(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds a prepare object with separator", () => {
            const column = 'name';
            const expectedResult = ", `name`";

            const result = new GroupBy(column).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});