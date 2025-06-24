import {describe, expect, test} from 'vitest';
import SelectRaw from "../../../../src/builder/statement/select/SelectRaw.js";

describe('Statement: Select', () => {
    describe('toString', () => {
        test("it builds a partial statement", () => {
            const expression = "count(id) as number_of_orders, customer_id";

            const result = new SelectRaw(expression).toString();

            expect(result).toEqual(expression);
        });

        test("it builds a partial statement with separator", () => {
            const expression = "count(id) as number_of_orders, customer_id";

            const expectedQuery = ", " + expression;

            const result = new SelectRaw(expression).toString(true);

            expect(result).toEqual(expectedQuery);
        });

        test("it builds a partial statement with bindings", () => {
            const expression = "price * ? as price_with_tax";
            const bindings = [1.8025];

            const expectedQuery = "price * 1.8025 as price_with_tax";

            const result = new SelectRaw(expression, bindings).toString();

            expect(result).toEqual(expectedQuery);
        });
    });

    describe('Prepare', () => {
        test("It builds select prepare object", () => {
            const expression = "count(id) as number_of_orders, customer_id";

            const result = new SelectRaw(expression).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual([]);
        });

        test("It builds select prepare object with separator", () => {
            const expression = "count(id) as number_of_orders, customer_id";

            const expectedQuery = ", " + expression;

            const result = new SelectRaw(expression).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });

        test("it builds a partial statement with bindings", () => {
            const expression = "price * ? as price_with_tax";
            const bindings = [1.8025];

            const result = new SelectRaw(expression, bindings).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual(bindings);
        });
    });
});