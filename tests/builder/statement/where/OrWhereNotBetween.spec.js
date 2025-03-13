import {describe, expect, test} from 'vitest';
import OrWhereNotBetween from "../../../../src/builder/statement/where/OrWhereNotBetween.js";

describe('Statement: OrWhereNotBetween', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "age NOT BETWEEN 20 AND 55";

            const result = new OrWhereNotBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "OR age NOT BETWEEN 20 AND 55";

            const result = new OrWhereNotBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});