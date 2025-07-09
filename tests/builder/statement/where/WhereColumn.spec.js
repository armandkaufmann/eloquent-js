import {describe, expect, test} from 'vitest';
import WhereColumn from "../../../../src/builder/statement/where/WhereColumn.js";

describe('Statement: WhereColumn', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'first_name';
           const operator = '=';
           const value = 'last_name';
           const expectedResult = "`first_name` = `last_name`";

           const result = new WhereColumn(column, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "AND `first_name` = `last_name`";

            const result = new WhereColumn(column, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared partial statement", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "`first_name` = `last_name`";

            const result = new WhereColumn(column, operator, value).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const column = 'first_name';
            const operator = '=';
            const value = 'last_name';
            const expectedResult = "AND `first_name` = `last_name`";

            const result = new WhereColumn(column, operator, value).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});