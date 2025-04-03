import {describe, expect, test} from 'vitest';
import OrHavingRaw from "../../../../src/builder/statement/having/OrHavingRaw.js";

describe('Statement: Or Having Raw', () => {
    describe('toString', () => {
       test("It builds having raw partial statement", () => {
           const expression = 'SUM(price) > 2500';

           const result = new OrHavingRaw(expression).toString();

           expect(result).toEqual(expression);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const expression = 'SUM(price) > 2500';
            const expectedQuery = `OR ${expression}`;

            const result = new OrHavingRaw(expression).toString(true);

            expect(result).toEqual(expectedQuery);
        });

        test("It builds where partial statement with bindings", () => {
            const expression = 'SUM(price) > ?';
            const bindings = [2500];

            const expectedQuery = 'SUM(price) > 2500';

            const result = new OrHavingRaw(expression, bindings).toString();

            expect(result).toEqual(expectedQuery);
        });
    });

    describe('Prepare', () => {
        test("It builds where prepare object", () => {
            const expression = 'SUM(price) > 2500';

            const result = new OrHavingRaw(expression).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepare object query with 'AND' when withSeparator is true", () => {
            const expression = 'SUM(price) > 2500';
            const expectedQuery = `OR ${expression}`;

            const result = new OrHavingRaw(expression).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual([]);
        });

        test("It builds where prepare object with bindings", () => {
            const expression = 'SUM(price) > ?';
            const bindings = [2500];

            const result = new OrHavingRaw(expression, bindings).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual(bindings);
        });
    });
});