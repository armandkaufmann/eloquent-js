import {describe, expect, test} from 'vitest';
import WhereAny from "../../../../src/builder/statement/where/WhereAny.js";

describe('Statement: WhereAny', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const columns = ['name', 'email', 'phone'];
           const operator = "LIKE";
           const value = 'Example%';
           const expectedResult = `(\`name\` ${operator} '${value}' OR \`email\` ${operator} '${value}' OR \`phone\` ${operator} '${value}')`;

           const result = new WhereAny(columns, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `AND (\`name\` ${operator} '${value}' OR \`email\` ${operator} '${value}' OR \`phone\` ${operator} '${value}')`;

            const result = new WhereAny(columns, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `(\`name\` ${operator} ? OR \`email\` ${operator} ? OR \`phone\` ${operator} ?)`;
            const expectedBindings = [value, value, value];

            const result = new WhereAny(columns, operator, value).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `AND (\`name\` ${operator} ? OR \`email\` ${operator} ? OR \`phone\` ${operator} ?)`;
            const expectedBindings = [value, value, value];

            const result = new WhereAny(columns, operator, value).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});