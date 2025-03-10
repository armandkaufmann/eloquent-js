import {describe, expect, test} from 'vitest';
import OrWhereNull from "../../../../src/builder/statement/where/OrWhereNull.js";

describe('Statement: OrWhere', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const expectedResult = "users IS NULL";

           const result = new OrWhereNull(column).toString();

           expect(result).toEqual(expectedResult);
       });

       test('Adds the "OR" when with separator is true', () => {
           const column = 'users';
           const expectedResult = "OR users IS NULL";

           const result = new OrWhereNull(column).toString(true);

           expect(result).toEqual(expectedResult);
       })
    });
});