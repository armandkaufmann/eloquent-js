import {describe, expect, test} from 'vitest';
import Having from "../../../../src/builder/statement/having/Having.js";

describe('Statement: Having', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'users';
           const operator = '=';
           const value = 'John';
           const expectedResult = "users = 'John'";

           const result = new Having(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds partial having with 'AND' when withSeparator is true", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';
            const expectedResult = "AND users = 'John'";

            const result = new Having(column, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "users = ?";

            const result = new Having(column, operator, value).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "AND users = ?";

            const result = new Having(column, operator, value).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});