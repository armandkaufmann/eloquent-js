import {describe, expect, test} from 'vitest';
import Offset from "../../../../src/builder/statement/offset/Offset.js";

describe('Statement: Offset', () => {
    describe('toString', () => {
        test("It builds a partial statement", () => {
            const expectedResult = "5";

            const result = new Offset(5).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds a partial statement with separator", () => {
            const expectedResult = "5";

            const result = new Offset(5).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const result = new Offset(5).prepare();

            expect(result.query).toEqual("?");
            expect(result.bindings).toEqual([5]);
        });
    });
});