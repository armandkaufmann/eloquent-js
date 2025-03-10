import {describe, expect, test} from 'vitest';
import WhereNotNull from "../../../../src/builder/statement/where/WhereNotNull.js";

describe('Statement: WhereNotNull', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const expectedResult = "users IS NOT NULL";

           const result = new WhereNotNull(column).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const expectedResult = "AND users IS NOT NULL";

            const result = new WhereNotNull(column).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});