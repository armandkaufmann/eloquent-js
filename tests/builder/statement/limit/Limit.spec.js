import {describe, expect, test} from 'vitest';
import Limit from "../../../../src/builder/statement/limit/Limit.js";

describe('Statement: Limit', () => {
    describe('toString', () => {
        test("It builds limit partial statement", () => {
            const expectedResult = "5";

            const result = new Limit(5).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds orderBy partial statement with separator and order", () => {
            const expectedResult = "5";

            const result = new Limit(5).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepare object orderBy partial statement", () => {
            const result = new Limit(5).prepare();

            expect(result.query).toEqual("?");
            expect(result.bindings).toEqual([5]);
        });
    });
});