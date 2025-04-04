import {describe, expect, test} from 'vitest';
import GroupByRaw from "../../../../src/builder/statement/group/GroupByRaw.js";

describe('Statement: Group', () => {
    describe('toString', () => {
        test("It builds select partial statement", () => {
            const expression = 'name, location, town';

            const result = new GroupByRaw(expression).toString();

            expect(result).toEqual(expression);
        });
    });

    describe('Prepare', () => {
        test("It builds prepare object select partial statement", () => {
            const expression = 'name, location, town';

            const result = new GroupByRaw(expression).prepare();

            expect(result.query).toEqual(expression);
            expect(result.bindings).toEqual([]);
        });
    });
});