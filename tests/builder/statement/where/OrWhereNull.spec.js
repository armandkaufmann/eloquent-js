import {describe, expect, test} from 'vitest';
import OrWhereNull from "../../../../src/builder/statement/where/OrWhereNull.js";

describe('Statement: OrWhereNull', () => {
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

    describe('Prepare', () => {
        test("It builds a prepare object with the correct values", () => {
            const column = 'users';
            const expectedResult = "users IS NULL";

            const result = new OrWhereNull(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test('It builds a prepare object query with "OR"', () => {
            const column = 'users';
            const expectedResult = "OR users IS NULL";

            const result = new OrWhereNull(column).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        })
    });
});