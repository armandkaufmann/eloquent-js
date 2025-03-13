import {describe, expect, test} from 'vitest';
import WhereBetween from "../../../../src/builder/statement/where/WhereBetween.js";

describe('Statement: WhereBetween', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "age BETWEEN 20 AND 55";

            const result = new WhereBetween(column, values).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It builds with 'AND' when withSeparator is true", () => {
            const column = 'age';
            const values = [20, 55];
            const expectedResult = "AND age BETWEEN 20 AND 55";

            const result = new WhereBetween(column, values).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});