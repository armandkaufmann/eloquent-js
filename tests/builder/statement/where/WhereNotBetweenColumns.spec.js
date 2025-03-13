import {describe, expect, test} from 'vitest';
import WhereNotBetweenColumns from "../../../../src/builder/statement/where/WhereNotBetweenColumns.js";

describe('Statement: WhereNotBetweenColumns', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "age NOT BETWEEN minimum_age AND maximum_age";

            const result = new WhereNotBetweenColumns(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = ['minimum_age', 'maximum_age'];
            const expectedResult = "AND age NOT BETWEEN minimum_age AND maximum_age";

            const result = new WhereNotBetweenColumns(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});