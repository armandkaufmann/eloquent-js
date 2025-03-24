import {describe, expect, test} from 'vitest';
import OrWhereBetween from "../../../../src/builder/statement/where/OrWhereBetween.js";
import WhereBetween from "../../../../src/builder/statement/where/WhereBetween.js";

describe('Statement: OrWhereBetween', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "age BETWEEN 20 AND 55";

            const result = new OrWhereBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "OR age BETWEEN 20 AND 55";

            const result = new OrWhereBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "age BETWEEN ? AND ?";

            const result = new OrWhereBetween(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test("It builds prepared statement with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "OR age BETWEEN ? AND ?";

            const result = new OrWhereBetween(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});