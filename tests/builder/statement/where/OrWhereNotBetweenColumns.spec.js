import {describe, expect, test} from 'vitest';
import OrWhereNotBetweenColumns from "../../../../src/builder/statement/where/OrWhereNotBetweenColumns.js";

describe('Statement: OrWhereNotBetweenColumns', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'price';
           const columns = ['low', 'high'];
           const expectedResult = "`price` NOT BETWEEN `low` AND `high`";

           const result = new OrWhereNotBetweenColumns(column, columns).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR `price` NOT BETWEEN `low` AND `high`";

            const result = new OrWhereNotBetweenColumns(column, columns).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "`price` NOT BETWEEN `low` AND `high`";

            const result = new OrWhereNotBetweenColumns(column, columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR `price` NOT BETWEEN `low` AND `high`";

            const result = new OrWhereNotBetweenColumns(column, columns).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});