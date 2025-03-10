import {describe, expect, test} from 'vitest';
import Select from "../../../../src/builder/statement/select/Select.js";

describe('Statement: Where', () => {
    describe('toString', () => {
        test("It builds where partial statement", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new Select(columns).toString();

            expect(result).toEqual(expectedResult);
        });

        test("It does not build with separator when withSeparator is true", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new Select(columns).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });
});