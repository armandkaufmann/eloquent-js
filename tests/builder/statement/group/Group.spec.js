import {describe, expect, test} from 'vitest';
import GroupBy from "../../../../src/builder/statement/group/GroupBy.js";

describe('Statement: Group', () => {
    describe('toString', () => {
        test("it builds a partial statement", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new GroupBy(columns).toString();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new GroupBy(columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});