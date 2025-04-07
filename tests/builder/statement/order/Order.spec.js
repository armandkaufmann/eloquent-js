import {describe, expect, test} from 'vitest';
import OrderBy from "../../../../src/builder/statement/order/OrderBy.js";

describe('Statement: Order', () => {
    describe('toString', () => {
        test("It builds orderBy partial statement", () => {
            const column = 'name';
            const expectedResult = "name ASC";

            const result = new OrderBy(column).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds orderBy partial statement with separator and order", () => {
            const column = 'name';
            const expectedResult = ", name DESC";

            const result = new OrderBy(column, "DESC").toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepare object orderBy partial statement", () => {
            const column = 'name';
            const expectedResult = "name ASC";

            const result = new OrderBy(column).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});