import {describe, expect, test} from 'vitest';
import WhereNotBetween from "../../../../src/builder/statement/where/WhereNotBetween.js";

describe('Statement: WhereNotBetween', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "`age` NOT BETWEEN 20 AND 55";

            const result = new WhereNotBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds a partial statement with separator", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "AND `age` NOT BETWEEN 20 AND 55";

            const result = new WhereNotBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "`age` NOT BETWEEN ? AND ?";

            const result = new WhereNotBetween(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test("It builds prepare object with separator", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "AND `age` NOT BETWEEN ? AND ?";

            const result = new WhereNotBetween(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});