import {describe, expect, test} from 'vitest';
import {Query} from "../../../../src/builder/Query.js";
import WhereExists from "../../../../src/builder/statement/where/WhereExists.js";

describe('Statement: WhereExists', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const query = Query.from('users').where('id', 5);
           const expectedResult = "EXISTS (SELECT * FROM `users` WHERE `id` = 5)";

           const result = new WhereExists(query).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "AND EXISTS (SELECT * FROM `users` WHERE `id` = 5)";

            const result = new WhereExists(query).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "EXISTS (SELECT * FROM `users` WHERE `id` = ?)";
            const expectedBindings = query.prepare().bindings;

            const result = new WhereExists(query).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "AND EXISTS (SELECT * FROM `users` WHERE `id` = ?)";
            const expectedBindings = query.prepare().bindings;

            const result = new WhereExists(query).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});