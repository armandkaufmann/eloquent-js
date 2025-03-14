import {describe, expect, test} from 'vitest';
import OrWhereIn from "../../../../src/builder/statement/where/OrWhereIn.js";

describe('Statement: OrWhereIn', () => {
    describe('toString', () => {
       test("It builds where partial statement", () => {
           const column = 'names';
           const values = ['John', 'Armand', 'Alex', 'Ian'];
           const expectedResult = "names IN ('John', 'Armand', 'Alex', 'Ian')";

           const result = new OrWhereIn(column, values).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedResult = "OR names IN ('John', 'Armand', 'Alex', 'Ian')";

            const result = new OrWhereIn(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('serialize', () => {
        test('It builds a prepare object with the correct values', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "names IN (?, ?, ?, ?)";

            const result = new OrWhereIn(column, values).prepare();

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });

        test('It builds a prepare object query with "AND"', () => {
            const column = 'names';
            const values = ['John', 'Armand', 'Alex', 'Ian'];
            const expectedQuery = "OR names IN (?, ?, ?, ?)";

            const result = new OrWhereIn(column, values).prepare(true);

            expect(result.query).toEqual(expectedQuery);
            expect(result.bindings).toEqual(values);
        });
    });
});