import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Builder from "../../../src/builder/statement/Builder.js";
import {STATEMENTS} from "../../../src/builder/statement/Base.js";
import OrWhere from "../../../src/builder/statement/where/OrWhere.js";
import Select from "../../../src/builder/statement/select/Select.js";
import WhereNull from "../../../src/builder/statement/where/WhereNull.js";
import OrWhereNull from "../../../src/builder/statement/where/OrWhereNull.js";

describe('Statement: Statement Builder', () => {
    describe("Select", () => {
        describe("toString", () => {
            test('it builds complete statement string', () => {
                const selectStatement = new Select(['name', 'age', 'sex']);
                const expectedResult = "SELECT name, age, sex";

                const builder = new Builder(STATEMENTS.select);
                builder.push(selectStatement);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });

            test("pushOrUpdate: does not append select statement if it exists", () => {
                const firstSelectStatement = new Select(['name', 'age', 'sex']);
                const secondSelectStatement = new Select(['location', 'role', 'preference']);
                const expectedResult = "SELECT location, role, preference";

                const builder = new Builder(STATEMENTS.select);
                builder.pushOrUpdate(firstSelectStatement).pushOrUpdate(secondSelectStatement);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });
        });
    });

    describe("Where", () => {
        describe('toString', () => {
            test('It builds complete statement string', () => {
                const first = new Where('name', '=', 'John');
                const second = new OrWhere('age', '>', 20);
                const third = new WhereNull('sex');
                const fourth = new OrWhereNull('taco');

                const expectedResult = "WHERE name = 'John' OR age > 20 AND sex IS NULL OR taco IS NULL"

                const builder = new Builder(STATEMENTS.where);
                builder.push(first).push(second).push(third).push(fourth);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });

            test('It returns an empty string if there are no statements', () => {
                const builder = new Builder(STATEMENTS.where);

                const result = builder.toString();

                expect(result).toEqual('');
            });
        });

        describe('prepare', () => {
            test('it builds the prepare object with correct values', () => {
                const first = new Where('name', '=', 'John');
                const second = new OrWhere('age', '>', 20);
                const third = new WhereNull('sex');
                const fourth = new OrWhereNull('taco');

                const expectedQuery = "WHERE name = ? OR age > ? AND sex IS NULL OR taco IS NULL"
                const expectedBindings = ['John', 20]

                const builder = new Builder(STATEMENTS.where);
                builder.push(first).push(second).push(third).push(fourth);

                const result = builder.prepare();

                expect(result.query).toEqual(expectedQuery);
                expect(result.bindings).toEqual(expectedBindings);
            });

            test('it builds an empty prepare object when no statements provided', () => {
                const builder = new Builder(STATEMENTS.where);

                const result = builder.prepare();

                expect(result.query).toEqual('');
                expect(result.bindings).toEqual([]);
            });
        });
    });
});