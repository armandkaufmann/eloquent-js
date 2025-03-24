import {describe, expect, test} from 'vitest';
import WhereBetweenColumns from "../../../../src/builder/statement/where/WhereBetweenColumns.js";

describe('Statement: WhereBetweenColumns', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "age BETWEEN minimum_age AND maximum_age";

            const result = new WhereBetweenColumns(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "AND age BETWEEN minimum_age AND maximum_age";

            const result = new WhereBetweenColumns(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object with the correct values", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "age BETWEEN minimum_age AND maximum_age";

            const result = new WhereBetweenColumns(column, values).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test('It builds a prepare object query with "AND"', () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "AND age BETWEEN minimum_age AND maximum_age";

            const result = new WhereBetweenColumns(column, values).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});