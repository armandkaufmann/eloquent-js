import {describe, expect, test} from 'vitest';
import WhereRaw from "../../../../src/builder/statement/where/WhereRaw.js";

describe('Statement: WhereRaw', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const expression = 'price > IF(state = "TX", 200, 100)';

           const result = new WhereRaw(expression).toString();

           expect(result).toEqual(expression);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const expression = 'price > IF(state = "TX", 200, 100)';
            const expectedQuery = `AND ${expression}`;

            const result = new WhereRaw(expression).toString(true);

            expect(result).toEqual(expectedQuery);
        });

        test("It builds a partial statement with bindings", () => {
            const expression = 'price > IF(state = "TX", ?, 100)';
            const bindings = [200];

            const expectedQuery = 'price > IF(state = "TX", 200, 100)';

            const result = new WhereRaw(expression, bindings).toString();

            expect(result).toEqual(expectedQuery);
        });
    });

    describe('Prepare', () => {
        test("It builds where prepare object", () => {
            const expression = 'price > IF(state = "TX", 200, 100)';

            const result = new WhereRaw(expression).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepare object with separator", () => {
            const expression = 'price > IF(state = "TX", 200, 100)';
            const expectedQuery = `AND ${expression}`;

            const result = new WhereRaw(expression).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });

        test("It builds where prepare object with bindings", () => {
            const expression = 'price > IF(state = "TX", ?, 100)';
            const bindings = [200];

            const result = new WhereRaw(expression, bindings).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual(bindings);
        });
    });
});