import {describe, expect, test} from 'vitest';
import From from "../../../../src/builder/statement/from/From.js";

describe('Statement: Select', () => {
    describe('toString', () => {
        test("It builds from partial statement without table alias", () => {
            const result = new From('users').toString();

            expect(result).toEqual("`users`");
        });

        test("It builds from partial statement with table alias", () => {
            const result = new From('users', 'u').toString();

            expect(result).toEqual("`users` AS `u`");
        });

        test("It does not add anything to string when withSeparator is true", () => {
            const result = new From('users', 'u').toString(true);

            expect(result).toEqual("`users` AS `u`");
        });
    });

    describe('Prepare', () => {
        test("It builds from partial statement without table alias", () => {
            const result = new From('users').prepare();

            expect(result.query).toEqual("`users`");
            expect(result.bindings).toEqual([]);
        });

        test("It builds from partial statement with table alias", () => {
            const result = new From('users', 'u').prepare();

            expect(result.query).toEqual("`users` AS `u`");
            expect(result.bindings).toEqual([]);
        });

        test("It does not add anything to string when withSeparator is true", () => {
            const result = new From('users', 'u').prepare(true);

            expect(result.query).toEqual("`users` AS `u`");
            expect(result.bindings).toEqual([]);
        });
    });
});