import {describe, expect, test} from 'vitest';
import OrWhere from "../../../../src/builder/statement/where/OrWhere.js";

describe('Statement: OrWhere', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const operator = '=';
           const value = 'John';
           const expectedResult = "users = 'John'";

           const result = new OrWhere(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

       test('Adds the "OR" when with separator is true', () => {
           const column = 'users';
           const operator = '=';
           const value = 'John';
           const expectedResult = "OR users = 'John'";

           const result = new OrWhere(column, operator, value).toString(true);

           expect(result).toEqual(expectedResult);
       })
    });
});