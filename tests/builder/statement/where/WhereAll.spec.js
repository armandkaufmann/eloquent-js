import {describe, expect, test} from 'vitest';
import WhereAll from "../../../../src/builder/statement/where/WhereAll.js";

describe('Statement: WhereAll', () => {
    describe('toString', () => {
       test("It builds a partial statement", () => {
           const columns = ['name', 'email', 'phone'];
           const operator = "LIKE";
           const value = 'Example%';
           const expectedResult = `(\`name\` ${operator} '${value}' AND \`email\` ${operator} '${value}' AND \`phone\` ${operator} '${value}')`;

           const result = new WhereAll(columns, operator, value).toString();

           expect(result).toEqual(expectedResult);
       });

        test("It builds a partial statement with separator", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `AND (\`name\` ${operator} '${value}' AND \`email\` ${operator} '${value}' AND \`phone\` ${operator} '${value}')`;

            const result = new WhereAll(columns, operator, value).toString(true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('Prepare', () => {
        test("It builds a prepare object", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `(\`name\` ${operator} ? AND \`email\` ${operator} ? AND \`phone\` ${operator} ?)`;
            const expectedBindings = [value, value, value];

            const result = new WhereAll(columns, operator, value).prepare();

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });

        test("It builds prepared object with separator", () => {
            const columns = ['name', 'email', 'phone'];
            const operator = "LIKE";
            const value = 'Example%';
            const expectedResult = `AND (\`name\` ${operator} ? AND \`email\` ${operator} ? AND \`phone\` ${operator} ?)`;
            const expectedBindings = [value, value, value];

            const result = new WhereAll(columns, operator, value).prepare(true);

            expect(result.query).toEqual(expectedResult);
            expect(result.bindings).toEqual(expectedBindings);
        });
    });
});