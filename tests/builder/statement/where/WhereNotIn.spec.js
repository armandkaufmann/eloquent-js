import {describe, expect, test} from 'vitest';
import WhereNotIn from "../../../../src/builder/statement/where/WhereNotIn.js";

describe('Statement: WhereNotIn', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'names';
           const values = ['John', 'Armand', 'Alex', 'Ian'];
           const expectedResult = "names NOT IN ('John', 'Armand', 'Alex', 'Ian')";

           const result = new WhereNotIn(column, values).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedResult = "AND names NOT IN ('John', 'Armand', 'Alex', 'Ian')";

            const result = new WhereNotIn(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('serialize', () => {
        test('It builds a prepare object with the correct values', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "names NOT IN (?, ?, ?, ?)";

            const result = new WhereNotIn(column, values).serialize();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test('It builds a prepare object query with "AND"', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "AND names NOT IN (?, ?, ?, ?)";

            const result = new WhereNotIn(column, values).serialize(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});