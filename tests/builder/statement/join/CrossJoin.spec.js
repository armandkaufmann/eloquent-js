import {describe, expect, test} from 'vitest';
import CrossJoin from "../../../../src/builder/statement/join/CrossJoin.js";

describe('Statement: CrossJoin', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const expectedResult = "CROSS JOIN posts";

           const result = new CrossJoin('posts').toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'CROSS JOIN' when withSeparator is true", () => {
            const expectedResult = "CROSS JOIN posts";

            const result = new CrossJoin('posts').toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const expectedResult = "CROSS JOIN posts";

            const result = new CrossJoin('posts').prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const expectedResult = "CROSS JOIN posts";

            const result = new CrossJoin('posts').prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});