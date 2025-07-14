import {describe, expect, test} from 'vitest';
import WhereBetween from "../../../../src/builder/statement/where/WhereBetween.js";

describe('Statement: WhereBetween', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "`age` BETWEEN 20 AND 55";

            const result = new WhereBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds a partial statement with separator", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "AND `age` BETWEEN 20 AND 55";

            const result = new WhereBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "`age` BETWEEN ? AND ?";

            const result = new WhereBetween(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test("It builds prepare object with separator", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedQuery = "AND `age` BETWEEN ? AND ?";

            const result = new WhereBetween(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});