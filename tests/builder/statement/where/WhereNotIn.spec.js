import {describe, expect, test} from 'vitest';
import WhereNotIn from "../../../../src/builder/statement/where/WhereNotIn.js";

describe('Statement: WhereNotIn', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const column = 'names';
           const values = ['John', 'Armand', 'Alex', 'Ian'];
           const expectedResult = "names NOT IN ('John', 'Armand', 'Alex', 'Ian')";

           const result = new WhereNotIn(column, values).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedResult = "AND names NOT IN ('John', 'Armand', 'Alex', 'Ian')";

            const result = new WhereNotIn(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test('It builds a prepare object', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "names NOT IN (?, ?, ?, ?)";

            const result = new WhereNotIn(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test('It builds a prepare object query with separator', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "AND names NOT IN (?, ?, ?, ?)";

            const result = new WhereNotIn(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});