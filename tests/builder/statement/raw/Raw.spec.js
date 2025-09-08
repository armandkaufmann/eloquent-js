import {describe, expect, test} from 'vitest';
import Raw from "../../../../src/builder/statement/raw/Raw.js";

describe('Statement: Raw', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const statement = 'COUNT(*) as count';
            const expectedResult = "COUNT(*) as count";

            const result = new Raw(statement).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds a partial statement with separator", () => {
            const statement = 'COUNT(*) as count';
            const expectedResult = ", COUNT(*) as count";

            const result = new Raw(statement).withSeparator(',').toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const statement = 'COUNT(*) as count';
            const expectedResult = "COUNT(*) as count";

            const result = new Raw(statement).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});