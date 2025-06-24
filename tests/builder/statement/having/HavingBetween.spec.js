import {describe, expect, test} from 'vitest';
import HavingBetween from "../../../../src/builder/statement/having/HavingBetween.js";

describe('Statement: HavingBetween', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedResult = "orders BETWEEN 5 AND 15";

            const result = new HavingBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds partial statement with separator", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedResult = "AND orders BETWEEN 5 AND 15";

            const result = new HavingBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedQuery = "orders BETWEEN ? AND ?";

            const result = new HavingBetween(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test("It builds prepared object with separator", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedQuery = "AND orders BETWEEN ? AND ?";

            const result = new HavingBetween(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});