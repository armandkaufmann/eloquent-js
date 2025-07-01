import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Group from "../../../src/builder/statement/Group.js";
import OrWhere from "../../../src/builder/statement/where/OrWhere.js";

describe('Statement: Group', () => {
    describe('toString', () => {
        test('It builds complete statement string', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedResult = "(`name` = 'John' OR `age` > 20 AND `sex` = 'M')"

            const group = new Group();
            group.push(first).push(second).push(third);

            const result = group.toString();

            expect(result).toEqual(expectedResult);
        });

        test('It returns an empty string if there are no statements', () => {
            const group = new Group();

            const result = group.toString();

            expect(result).toEqual('');
        });

        test('It builds complete statement string with "AND" condition', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedResult = "AND (`name` = 'John' OR `age` > 20 AND `sex` = 'M')"

            const group = new Group();
            group.push(first).push(second).push(third);

            const result = group.toString(true);

            expect(result).toEqual(expectedResult);
        });

        test('It builds complete statement string with "OR" condition', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedResult = "OR (`name` = 'John' OR `age` > 20 AND `sex` = 'M')";

            const group = new Group("OR");
            group.push(first).push(second).push(third);

            const result = group.toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe("Prepare", () => {
        test('It builds complete prepare object', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedBindings = ['John', 20, 'M'];
            const expectedQuery = "(`name` = ? OR `age` > ? AND `sex` = ?)";

            const group = new Group();
            group.push(first).push(second).push(third);

            const result = group.prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test('It returns builds an empty prepare object when no statements are provided', () => {
            const group = new Group();

            const result = group.prepare();

            expect(result.query).toEqual('');
            expect(result.bindings).toEqual([]);
        });

        test('It builds prepare object with "AND" condition', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedBindings = ['John', 20, 'M'];
            const expectedQuery = "AND (`name` = ? OR `age` > ? AND `sex` = ?)"

            const group = new Group();
            group.push(first).push(second).push(third);

            const result = group.prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test('It builds prepare object with "OR" condition', () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new Where('sex', '=', 'M');

            const expectedBindings = ['John', 20, 'M'];
            const expectedQuery = "OR (`name` = ? OR `age` > ? AND `sex` = ?)"

            const group = new Group("OR");
            group.push(first).push(second).push(third);

            const result = group.prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});