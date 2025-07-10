import {describe, expect, test} from 'vitest';
import OrHaving from "../../../../src/builder/statement/having/OrHaving.js";

describe('Statement: OrHaving', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'users';
           const operator = '=';
           const value = 'John';
           const expectedResult = "`users` = 'John'";

           const result = new OrHaving(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds partial statement with separator", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';
            const expectedResult = "OR `users` = 'John'";

            const result = new OrHaving(column, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "`users` = ?";

            const result = new OrHaving(column, operator, value).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const column = 'users';
            const operator = '=';
            const value = 'John';

            const expectedBindings = [value];
            const expectedQuery = "OR `users` = ?";

            const result = new OrHaving(column, operator, value).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});