import {describe, expect, test} from 'vitest';
import LeftJoin from "../../../../src/builder/statement/join/LeftJoin.js";

describe('Statement: LeftJoin', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id";

           const result = new LeftJoin('posts', 'users.id', '=', 'posts.user_id').toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'LEFT JOIN' when withSeparator is true", () => {
            const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id";

            const result = new LeftJoin('posts', 'users.id', '=', 'posts.user_id').toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id";

            const result = new LeftJoin('posts', 'users.id', '=', 'posts.user_id').prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with separator", () => {
            const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id";

            const result = new LeftJoin('posts', 'users.id', '=', 'posts.user_id').prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});