import {describe, expect, test} from 'vitest';
import OrWhereNotBetweenColumns from "../../../../src/builder/statement/where/OrWhereNotBetweenColumns.js";

describe('Statement: OrWhereNotBetweenColumns', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'price';
           const columns = ['low', 'high'];
           const expectedResult = "price < low AND price > high";

           const result = new OrWhereNotBetweenColumns(column, columns).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR price < low AND price > high";

            const result = new OrWhereNotBetweenColumns(column, columns).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "price < low AND price > high";

            const result = new OrWhereNotBetweenColumns(column, columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with 'AND' when withSeparator is true", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR price < low AND price > high";

            const result = new OrWhereNotBetweenColumns(column, columns).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});