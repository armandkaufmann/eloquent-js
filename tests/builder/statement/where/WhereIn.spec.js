import {describe, expect, test} from 'vitest';
import WhereIn from "../../../../src/builder/statement/where/WhereIn.js";

describe('Statement: WhereIn', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'names';
           const values = ['John', 'Armand', 'Alex', 'Ian'];
           const expectedResult = "names IN ('John', 'Armand', 'Alex', 'Ian')";

           const result = new WhereIn(column, values).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedResult = "AND names IN ('John', 'Armand', 'Alex', 'Ian')";

            const result = new WhereIn(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('serialize', () => {
        test('It builds a prepare object with the correct values', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "names IN (?, ?, ?, ?)";

            const result = new WhereIn(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test('It builds a prepare object query with "AND"', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "AND names IN (?, ?, ?, ?)";

            const result = new WhereIn(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});