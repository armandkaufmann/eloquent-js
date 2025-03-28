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
import WhereBetween from "../../../src/builder/statement/where/WhereBetween.js";
import InnerJoin from "../../../src/builder/statement/join/InnerJoin.js";
import LeftJoin from "../../../src/builder/statement/join/LeftJoin.js";
import CrossJoin from "../../../src/builder/statement/join/CrossJoin.js";

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

            test("push: appends select statement if it exists", () => {
                const firstSelectStatement = new Select(['name', 'age', 'sex']);
                const secondSelectStatement = new Select(['location', 'role', 'preference']);
                const expectedResult = "SELECT name, age, sex, location, role, preference";

                const builder = new Builder(STATEMENTS.select);
                builder.push(firstSelectStatement).push(secondSelectStatement);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });

            test("it defaults to '*' when no select columns provided", () => {
                const expectedResult = "SELECT *";

                const builder = new Builder(STATEMENTS.select);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("prepare", () => {
            test('it builds complete prepareObject', () => {
                const selectStatement = new Select(['name', 'age', 'sex']);
                const expectedResult = "SELECT name, age, sex";

                const builder = new Builder(STATEMENTS.select);
                builder.push(selectStatement);

                const result = builder.prepare();

                expect(result.query).toEqual(expectedResult);
                expect(result.bindings).toEqual([]);
            });

            test("push: appends select statement if it exists", () => {
                const firstSelectStatement = new Select(['name', 'age', 'sex']);
                const secondSelectStatement = new Select(['location', 'role', 'preference']);
                const expectedResult = "SELECT name, age, sex, location, role, preference";

                const builder = new Builder(STATEMENTS.select);
                builder.push(firstSelectStatement).push(secondSelectStatement);

                const result = builder.prepare();

                expect(result.query).toEqual(expectedResult);
                expect(result.bindings).toEqual([]);
            });

            test("it defaults to '*' when no select columns provided", () => {
                const expectedResult = "SELECT *";

                const builder = new Builder(STATEMENTS.select);

                const result = builder.prepare();

                expect(result.query).toEqual(expectedResult);
                expect(result.bindings).toEqual([]);
            });
        });
    });

    describe("Join", () => {
        describe("All joins", () => {
            test("Can combine all joins together", () => {
                const innerJoin = new InnerJoin('posts', 'users.id', '=', 'posts.user_id');
                const leftJoin = new LeftJoin('comments', 'users.id', '=', 'comments.user_id');
                const crossJoin = new CrossJoin('likes');
                const expectedResult = "INNER JOIN posts ON users.id = posts.user_id LEFT JOIN comments ON users.id = comments.user_id CROSS JOIN likes";

                const builder = new Builder(STATEMENTS.join);
                builder.push(innerJoin).push(leftJoin).push(crossJoin);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("Inner Join", () => {
            describe("toString", () => {
                test("It builds complete statement string", () => {
                    const firstJoin = new InnerJoin('posts', 'users.id', '=', 'posts.user_id');
                    const secondJoin = new InnerJoin('comments', 'users.id', '=', 'comments.user_id');
                    const expectedResult = "INNER JOIN posts ON users.id = posts.user_id INNER JOIN comments ON users.id = comments.user_id";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString();

                    expect(result).toEqual(expectedResult);
                });

                test("It builds complete statement string and disregards withStatement = true", () => {
                    const firstJoin = new InnerJoin('posts', 'users.id', '=', 'posts.user_id');
                    const secondJoin = new InnerJoin('comments', 'users.id', '=', 'comments.user_id');
                    const expectedResult = "INNER JOIN posts ON users.id = posts.user_id INNER JOIN comments ON users.id = comments.user_id";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString(true);

                    expect(result).toEqual(expectedResult);
                });
            });
        });

        describe("Left Join", () => {
            describe("toString", () => {
                test("It builds complete statement string", () => {
                    const firstJoin = new LeftJoin('posts', 'users.id', '=', 'posts.user_id');
                    const secondJoin = new LeftJoin('comments', 'users.id', '=', 'comments.user_id');
                    const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id LEFT JOIN comments ON users.id = comments.user_id";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString();

                    expect(result).toEqual(expectedResult);
                });

                test("It builds complete statement string and disregards withStatement = true", () => {
                    const firstJoin = new LeftJoin('posts', 'users.id', '=', 'posts.user_id');
                    const secondJoin = new LeftJoin('comments', 'users.id', '=', 'comments.user_id');
                    const expectedResult = "LEFT JOIN posts ON users.id = posts.user_id LEFT JOIN comments ON users.id = comments.user_id";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString(true);

                    expect(result).toEqual(expectedResult);
                });
            });
        });

        describe("Cross Join", () => {
            describe("toString", () => {
                test("It builds complete statement string", () => {
                    const firstJoin = new CrossJoin('posts');
                    const secondJoin = new CrossJoin('comments');
                    const expectedResult = "CROSS JOIN posts CROSS JOIN comments";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString();

                    expect(result).toEqual(expectedResult);
                });

                test("It builds complete statement string and disregards withStatement = true", () => {
                    const firstJoin = new CrossJoin('posts');
                    const secondJoin = new CrossJoin('comments');
                    const expectedResult = "CROSS JOIN posts CROSS JOIN comments";

                    const builder = new Builder(STATEMENTS.join);
                    builder.push(firstJoin).push(secondJoin);

                    const result = builder.toString(true);

                    expect(result).toEqual(expectedResult);
                });
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
        describe("toString", () => {
            test("it can group queries", () => {
                const first = new Where('name', '=', 'John');
                const second = new OrWhere('age', '>', 20);
                const third = new WhereNull('sex');
                const fourth = new OrWhereNull('taco');
                const fifth = new WhereNotNull('mouse');

                const expectedResult = "WHERE name = 'John' AND (age > 20 AND sex IS NULL) OR taco IS NULL AND mouse IS NOT NULL"

                const builder = new Builder(STATEMENTS.where);
                const group = new Group();
                builder.push(first)

                group.push(second).push(third);
                builder.push(group);

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
                const group = new Group();

                builder.push(first)
                builder.push(group);
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
                const group = new Group();

                group.push(first).push(second).push(third);
                builder.push(group);

                builder.push(fourth).push(fifth);

                const result = builder.toString();

                expect(result).toEqual(expectedResult);
            });
        });

        describe("Prepare", () => {
            test("it can prepare group queries", () => {
                const first = new Where('name', '=', 'John');
                const second = new OrWhere('age', '>', 20);
                const third = new Where('role', '=', 'admin');
                const fourth = new OrWhereNull('taco');
                const fifth = new WhereBetween('hours', [20, 40]);

                const expectedBindings = ['John', 20, 'admin', 20, 40];
                const expectedQuery = "WHERE name = ? AND (age > ? AND role = ?) OR taco IS NULL AND hours BETWEEN ? AND ?"

                const builder = new Builder(STATEMENTS.where);
                const group = new Group();
                builder.push(first)

                group.push(second).push(third);
                builder.push(group);

                builder.push(fourth).push(fifth);

                const result = builder.prepare();

                expect(result.query).toEqual(expectedQuery);
                expect(result.bindings).toEqual(expectedBindings);
            });
        })
    });
});