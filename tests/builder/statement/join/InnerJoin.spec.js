import {describe, expect, test} from 'vitest';
import InnerJoin from "../../../../src/builder/statement/join/InnerJoin.js";

describe('Statement: InnerJoin', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const expectedResult = "INNER JOIN posts ON users.id = posts.user_id";

           const result = new InnerJoin('posts', 'users.id', '=', 'posts.user_id').toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'INNER JOIN' when withSeparator is true", () => {
            const expectedResult = "INNER JOIN posts ON users.id = posts.user_id";

            const result = new InnerJoin('posts', 'users.id', '=', 'posts.user_id').toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds prepared where partial statement", () => {
            const expectedResult = "INNER JOIN posts ON users.id = posts.user_id";

            const result = new InnerJoin('posts', 'users.id', '=', 'posts.user_id').prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It builds prepared object with 'AND' when withSeparator is true", () => {
            const expectedResult = "INNER JOIN posts ON users.id = posts.user_id";

            const result = new InnerJoin('posts', 'users.id', '=', 'posts.user_id').prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});