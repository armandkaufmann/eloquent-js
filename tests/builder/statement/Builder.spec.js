import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Builder from "../../../src/builder/statement/Builder.js";
import {STATEMENTS} from "../../../src/builder/statement/Base.js";
import OrWhere from "../../../src/builder/statement/where/OrWhere.js";

describe('Statement: Where Statement Builder', () => {
    describe('toString', () => {
        test('It builds complete statement string', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedResult = "WHERE name = 'John' OR age > 20 AND sex = 'M'"

            const builder = new Builder(STATEMENTS.where);
            builder.push(first).push(second).push(third);

            const result = builder.toString();

            expect(result).toEqual(expectedResult);
        });

        test('It returns an empty string if there are no statements', () => {
            const builder = new Builder(STATEMENTS.where);

            const result = builder.toString();

            expect(result).toEqual('');
        });
    });

    describe('prepare', () => {
        test('it builds the prepare object with correct values', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedQuery = "WHERE name = ? OR age > ? AND sex = ?"
            const expectedBindings = ['John', 20, 'M']

            const builder = new Builder(STATEMENTS.where);
            builder.push(first).push(second).push(third);

            const result = builder.prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test('it builds an empty prepare object when no statements provided', () => {
            const builder = new Builder(STATEMENTS.where);

            const result = builder.prepare();

            expect(result.query).toEqual('');
            expect(result.bindings).toEqual([]);
        });
    });
});