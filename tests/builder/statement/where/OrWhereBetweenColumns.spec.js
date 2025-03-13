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
});