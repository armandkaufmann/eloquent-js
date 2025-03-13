import {describe, expect, test} from 'vitest';
import OrWhereNotBetweenColumns from "../../../../src/builder/statement/where/OrWhereNotBetweenColumns.js";

describe('Statement: WhereNotBetweenColumns', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "age NOT BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereNotBetweenColumns(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "OR age NOT BETWEEN minimum_age AND maximum_age";

            const result = new OrWhereNotBetweenColumns(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});