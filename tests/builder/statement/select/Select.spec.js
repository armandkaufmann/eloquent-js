import {describe, expect, test} from 'vitest';
import Select from "../../../../src/builder/statement/select/Select.js";

describe('Statement: Select', () => {
    describe('toString', () => {
        test("it builds a partial statement", () => {
            const column = 'name';
            const expectedResult = "`name`";

            const result = new Select(column).toString();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'name';
            const expectedResult = "`name`";

            const result = new Select(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});