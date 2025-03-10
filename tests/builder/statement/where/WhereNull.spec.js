import {describe, expect, test} from 'vitest';
import WhereNull from "../../../../src/builder/statement/where/WhereNull.js";

describe('Statement: WhereNull', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const expectedResult = "users IS NULL";

           const result = new WhereNull(column).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const expectedResult = "AND users IS NULL";

            const result = new WhereNull(column).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});