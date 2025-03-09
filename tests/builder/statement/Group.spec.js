import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Builder from "../../../src/builder/statement/Builder.js";
import {STATEMENTS} from "../../../src/builder/statement/Base.js";
import Group from "../../../src/builder/statement/Group.js";

describe('Statement: Group', () => {
    describe('toString', () => {
        test('It builds complete statement string', () => {
            const first = new Where('name', '=', 'John');
            const second = new Where('age', '>', 20, 'OR');
            const third = new Where('sex', '=', 'M');

            const expectedResult = "(name = 'John' OR age > 20 AND sex = 'M')"

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
    });
});