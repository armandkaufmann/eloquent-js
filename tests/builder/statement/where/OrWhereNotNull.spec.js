import {describe, expect, test} from 'vitest';
import OrWhereNotNull from "../../../../src/builder/statement/where/OrWhereNotNull.js";

describe('Statement: OrWhereNotNull', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const expectedResult = "users IS NOT NULL";

           const result = new OrWhereNotNull(column).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const expectedResult = "OR users IS NOT NULL";

            const result = new OrWhereNotNull(column).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});