import {describe, expect, test} from 'vitest';
import WhereNotBetween from "../../../../src/builder/statement/where/WhereNotBetween.js";

describe('Statement: WhereBetween', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "age NOT BETWEEN 20 and 55";

            const result = new WhereNotBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "AND age NOT BETWEEN 20 and 55";

            const result = new WhereNotBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});