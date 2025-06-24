import {describe, expect, test} from 'vitest';
import OrWhereColumn from "../../../../src/builder/statement/where/OrWhereColumn.js";

describe('Statement: OrWhereColumn', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'first_name';
           const operator = '=';
           const value = 'last_name';
           const expectedResult = "first_name = last_name";

           const result = new OrWhereColumn(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "OR first_name = last_name";

            const result = new OrWhereColumn(column, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "first_name = last_name";

            const result = new OrWhereColumn(column, operator, value).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "OR first_name = last_name";

            const result = new OrWhereColumn(column, operator, value).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});