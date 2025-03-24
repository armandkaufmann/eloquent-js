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

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';
            const expectedResult = "AND users = 'John'";

            const result = new Where(column, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "users = ?";

            const result = new Where(column, operator, value).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "AND users = ?";

            const result = new Where(column, operator, value).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});