import {describe, expect, test} from 'vitest';
import OrHavingBetween from "../../../../src/builder/statement/having/OrHavingBetween.js";

describe('Statement: OrHavingBetween', () => {
    describe('toString', () => {
        test("It builds having partial statement", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedResult = "orders BETWEEN 5 AND 15";

            const result = new OrHavingBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds partial having with 'AND' when withSeparator is true", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedResult = "OR orders BETWEEN 5 AND 15";

            const result = new OrHavingBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared object where partial statement", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedQuery = "orders BETWEEN ? AND ?";

            const result = new OrHavingBetween(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test("It builds prepared object with 'AND' when withSeparator is true", () => {
            const column = 'orders';
            const values = [5, 15];
            const expectedQuery = "OR orders BETWEEN ? AND ?";

            const result = new OrHavingBetween(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});