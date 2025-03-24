import {describe, expect, test} from 'vitest';
import Where from "../../../src/builder/statement/where/Where.js";
import Builder from "../../../src/builder/statement/Builder.js";
import {STATEMENTS} from "../../../src/builder/statement/Base.js";
import OrWhere from "../../../src/builder/statement/where/OrWhere.js";
import Select from "../../../src/builder/statement/select/Select.js";
import WhereNull from "../../../src/builder/statement/where/WhereNull.js";
import OrWhereNull from "../../../src/builder/statement/where/OrWhereNull.js";
import WhereNotNull from "../../../src/builder/statement/where/WhereNotNull.js";
import Group from "../../../src/builder/statement/Group.js";

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

            test("push: does not append select statement if it exists", () => {
                const firstSelectStatement = new Select(['name', 'age', 'sex']);
                const secondSelectStatement = new Select(['location', 'role', 'preference']);
                const expectedResult = "SELECT location, role, preference";

                const builder = new Builder(STATEMENTS.select);
                builder.push(firstSelectStatement).push(secondSelectStatement);

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
                const fifth = new WhereNotNull('mouse');

                const expectedResult = "WHERE name = 'John' OR age > 20 AND sex IS NULL OR taco IS NULL AND mouse IS NOT NULL"

                const builder = new Builder(STATEMENTS.where);
                builder.push(first).push(second).push(third).push(fourth).push(fifth);

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
                const fifth = new WhereNotNull('mouse');

                const expectedQuery = "WHERE name = ? OR age > ? AND sex IS NULL OR taco IS NULL AND mouse IS NOT NULL"
                const expectedBindings = ['John', 20]

                const builder = new Builder(STATEMENTS.where);
                builder.push(first).push(second).push(third).push(fourth).push(fifth);

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

    describe("Group queries", () => {
        test("it can group queries", () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new WhereNull('sex');
            const fourth = new OrWhereNull('taco');
            const fifth = new WhereNotNull('mouse');

            const expectedResult = "WHERE name = 'John' AND (age > 20 AND sex IS NULL) OR taco IS NULL AND mouse IS NOT NULL"

            const builder = new Builder(STATEMENTS.where);
            builder.push(first)

            builder.setGroupStatement(new Group());
            builder.push(second).push(third);
            builder.unsetGroupStatement();

            builder.push(fourth).push(fifth);

            const result = builder.toString();

            expect(result).toEqual(expectedResult);
        });

        test("it omits the group if no queries exist within it", () => {
            const first = new Where('name', '=', 'John');
            const fourth = new OrWhereNull('taco');
            const fifth = new WhereNotNull('mouse');

            const expectedResult = "WHERE name = 'John' OR taco IS NULL AND mouse IS NOT NULL"

            const builder = new Builder(STATEMENTS.where);
            builder.push(first)

            builder.setGroupStatement(new Group());
            builder.unsetGroupStatement();

            builder.push(fourth).push(fifth);

            const result = builder.toString();

            expect(result).toEqual(expectedResult);
        });

        test("it does not add the condition if it is the first", () => {
            const first = new Where('name', '=', 'John');
            const second = new OrWhere('age', '>', 20);
            const third = new WhereNull('sex');
            const fourth = new OrWhereNull('taco');
            const fifth = new WhereNotNull('mouse');

            const expectedResult = "WHERE (name = 'John' OR age > 20 AND sex IS NULL) OR taco IS NULL AND mouse IS NOT NULL"

            const builder = new Builder(STATEMENTS.where);

            builder.setGroupStatement(new Group());
            builder.push(first).push(second).push(third);
            builder.unsetGroupStatement();

            builder.push(fourth).push(fifth);

            const result = builder.toString();

            expect(result).toEqual(expectedResult);
        });
    });
});