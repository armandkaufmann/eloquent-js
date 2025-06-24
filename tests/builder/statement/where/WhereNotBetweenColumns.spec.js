import {describe, expect, test} from 'vitest';
import WhereNotBetweenColumns from "../../../../src/builder/statement/where/WhereNotBetweenColumns.js";

describe('Statement: WhereNotBetweenColumns', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'price';
           const columns = ['low', 'high'];
           const expectedResult = "price < low AND price > high";

           const result = new WhereNotBetweenColumns(column, columns).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "AND price < low AND price > high";

            const result = new WhereNotBetweenColumns(column, columns).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "price < low AND price > high";

            const result = new WhereNotBetweenColumns(column, columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "AND price < low AND price > high";

            const result = new WhereNotBetweenColumns(column, columns).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});