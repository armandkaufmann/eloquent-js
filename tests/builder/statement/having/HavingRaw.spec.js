import {describe, expect, test} from 'vitest';
import HavingRaw from "../../../../src/builder/statement/having/HavingRaw.js";

describe('Statement: Having Raw', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const expression = 'SUM(price) > 2500';

           const result = new HavingRaw(expression).toString();

           expect(result).toEqual(expression);
       });

        test("It builds partial statement with separator", () => {
            const expression = 'SUM(price) > 2500';
            const expectedQuery = `AND ${expression}`;

            const result = new HavingRaw(expression).toString(true);

            expect(result).toEqual(expectedQuery);
        });

        test("It builds partial statement with bindings", () => {
            const expression = 'SUM(price) > ?';
            const bindings = [2500];

            const expectedQuery = 'SUM(price) > 2500';

            const result = new HavingRaw(expression, bindings).toString();

            expect(result).toEqual(expectedQuery);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const expression = 'SUM(price) > 2500';

            const result = new HavingRaw(expression).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepare object statement with separator", () => {
            const expression = 'SUM(price) > 2500';
            const expectedQuery = `AND ${expression}`;

            const result = new HavingRaw(expression).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepare object with bindings", () => {
            const expression = 'SUM(price) > ?';
            const bindings = [2500];

            const result = new HavingRaw(expression, bindings).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual(bindings);
        });
    });
});