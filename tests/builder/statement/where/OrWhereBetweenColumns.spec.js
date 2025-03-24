import {describe, expect, test} from 'vitest';
import OrWhereBetweenColumns from "../../../../src/builder/statement/where/OrWhereBetweenColumns.js";

describe('Statement: OrWhereBetweenColumns', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "age BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereBetweenColumns(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "OR age BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereBetweenColumns(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedQuery = "age BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereBetweenColumns(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedQuery = "OR age BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereBetweenColumns(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });
    });
});