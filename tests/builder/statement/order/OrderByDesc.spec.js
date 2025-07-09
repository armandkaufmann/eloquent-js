import {describe, expect, test} from 'vitest';
import OrderByDesc from "../../../../src/builder/statement/order/OrderByDesc.js";

describe('Statement: OrderByDesc', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const column = 'name';
            const expectedResult = "`name` DESC";

            const result = new OrderByDesc(column).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds a partial statement with separator", () => {
            const column = 'name';
            const expectedResult = ", `name` DESC";

            const result = new OrderByDesc(column, "DESC").toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const column = 'name';
            const expectedResult = "`name` DESC";

            const result = new OrderByDesc(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});