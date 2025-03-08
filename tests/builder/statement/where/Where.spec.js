import {describe, expect, test} from 'vitest';
import Where from "../../../../src/builder/statement/where/Where.js";

describe('Statement: Where', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'users';
           const operator = '=';
           const value = 'John';
           const expectedResult = "users = 'John'";

           const result = new Where(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });
    });
});