import {describe, expect, test} from 'vitest';
import OrWhereBetweenColumns from "../../../../src/builder/statement/where/OrWhereBetweenColumns.js";

describe('Statement: WhereBetweenColumns', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'price';
           const columns = ['low', 'high'];
           const expectedResult = "price >= low AND price <= high"

           const result = new OrWhereBetweenColumns(column, columns).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR price >= low AND price <= high"

            const result = new OrWhereBetweenColumns(column, columns).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "price >= low AND price <= high"

            const result = new OrWhereBetweenColumns(column, columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with 'AND' when withSeparator is true", () => {
            const column = 'price';
            const columns = ['low', 'high'];
            const expectedResult = "OR price >= low AND price <= high"

            const result = new OrWhereBetweenColumns(column, columns).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});