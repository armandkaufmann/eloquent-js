import {describe, expect, test} from 'vitest';
import Select from "../../../../src/builder/statement/select/Select.js";

describe('Statement: Select', () => {
    describe('toString', () => {
        test("It builds select partial statement", () => {
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

    describe('Prepare', () => {
        test("It builds prepare object select partial statement", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new Select(columns).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });

        test("It does not build prepare object with separator when withSeparator is true", () => {
            const columns = ['name', 'age', 'sex'];
            const expectedResult = "name, age, sex";

            const result = new Select(columns).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual([]);
        });
    });
});