import {describe, expect, test} from 'vitest';
import {Query} from "../../../../src/builder/Query.js";
import WhereNotExists from "../../../../src/builder/statement/where/WhereNotExists.js";

describe('Statement: WhereNotExists', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const query = Query.from('users').where('id', 5);
           const expectedResult = "NOT EXISTS (SELECT * FROM `users` WHERE `id` = 5)";

           const result = new WhereNotExists(query).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "AND NOT EXISTS (SELECT * FROM `users` WHERE `id` = 5)";

            const result = new WhereNotExists(query).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "NOT EXISTS (SELECT * FROM `users` WHERE `id` = ?)";
            const expectedBindings = query.prepare().bindings;

            const result = new WhereNotExists(query).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const query = Query.from('users').where('id', 5);
            const expectedResult = "AND NOT EXISTS (SELECT * FROM `users` WHERE `id` = ?)";
            const expectedBindings = query.prepare().bindings;

            const result = new WhereNotExists(query).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});