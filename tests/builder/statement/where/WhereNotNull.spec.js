import {describe, expect, test} from 'vitest';
import WhereNotNull from "../../../../src/builder/statement/where/WhereNotNull.js";

describe('Statement: WhereNotNull', () => {
    describe('toString', () => {
       test("It builds partial statement", () => {
           const column = 'users';
           const expectedResult = "users IS NOT NULL";

           const result = new WhereNotNull(column).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds partial statement with separator", () => {
            const column = 'users';
            const expectedResult = "AND users IS NOT NULL";

            const result = new WhereNotNull(column).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object with a partial statement", () => {
            const column = 'users';
            const expectedResult = "users IS NOT NULL";

            const result = new WhereNotNull(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test('It builds a prepare object with separator', () => {
            const column = 'users';
            const expectedResult = "AND users IS NOT NULL";

            const result = new WhereNotNull(column).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});