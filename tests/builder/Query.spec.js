import {describe, expect, beforeEach, test, vi} from 'vitest';
import {Query} from "../../src/builder/Query.js";
import {
    InvalidComparisonOperatorError,
    InvalidBetweenValueArrayLength,
    TableNotSetError
} from "../../src/errors/QueryBuilder/Errors.js";
import {DB} from "../../src/DB.js";

vi.mock("../../src/DB.js", () => {
    const DB = vi.fn();
    DB.prototype.insert = vi.fn()

    return {DB}
});

describe("QueryBuilderTest", () => {
    describe("Building Query Strings", () => {
        describe("To Sql", () => {
            test("Base query string", () => {
                const result = new Query()
                    .from('my_table')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `my_table`");
            });

            describe("Throws when table is not set", () => {
                let query = null;

                beforeEach(() => {
                    query = new Query();
                });

                test("Get", () => {
                    expect(() => query.get()).toThrow(TableNotSetError);
                });

                test("First", () => {
                    expect(() => new Query().first()).toThrow(TableNotSetError);
                });

                test("Insert", async () => {
                    await expect(async () => await query.insert({taco: 'tuesday'})).rejects.toThrowError(TableNotSetError);
                });

                test("Update", () => {
                    expect(() => query.update({taco: 'tuesday'})).toThrow(TableNotSetError);
                });
            })

            test("Select", () => {
                const result = Query
                    .from('my_table')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM `my_table`";

                expect(result).toBe(expectedResult);
            });

            test("builds full query in correct order", () => {
                const result = Query.toSql()
                    .from('my_table')
                    .where('name', '=', 'John')
                    .select('id', 'name')
                    .limit(2)
                    .groupBy('class')
                    .offset(5)
                    .leftJoin('comments', 'my_table.id', '=', 'comments.my_table_id')
                    .orderBy('id')
                    .having('class', 'LIKE', '%example%')
                    .get();

                const expectedResult = "SELECT `id`, `name` FROM `my_table` LEFT JOIN comments ON my_table.id = comments.my_table_id WHERE `name` = 'John' GROUP BY class HAVING class LIKE '%example%' ORDER BY id DESC LIMIT 2 OFFSET 5"

                expect(result).toBe(expectedResult);
            });
        });

        describe("Where", () => {
            test("Query String", () => {
                const result = new Query()
                    .from('my_table')
                    .where('test_id', '=', 5)
                    .where('test_name', '=', 'John')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM `my_table` WHERE `test_id` = 5 AND `test_name` = 'John'";

                expect(result).toBe(expectedResult);
            });

            test("Operator defaults to equals when omitted", () => {
                const result = new Query()
                    .from('my_table')
                    .where('test_id', 5)
                    .where('test_name', 'John')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM `my_table` WHERE `test_id` = 5 AND `test_name` = 'John'";

                expect(result).toBe(expectedResult);
            });

            describe("Where Raw/Or Where Raw", () => {
                test("WhereRaw: Builds query string without bindings", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereRaw("price > IF(state = 'TX', 200, 100)")
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND price > IF(state = 'TX', 200, 100)";

                    expect(result).toBe(expectedResult);
                });

                test("WhereRaw: Builds query string with bindings", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereRaw("price > IF(state = 'TX', ?, 100)", [200])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND price > IF(state = 'TX', 200, 100)";

                    expect(result).toBe(expectedResult);
                });

                test("OrWhereRaw: Builds query string without bindings", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereRaw("price > IF(state = 'TX', 200, 100)")
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' OR price > IF(state = 'TX', 200, 100)";

                    expect(result).toBe(expectedResult);
                });

                test("OrWhereRaw: Builds query string with bindings", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereRaw("price > IF(state = 'TX', ?, 100)", [200])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' OR price > IF(state = 'TX', 200, 100)";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where null/not null", () => {
                test("Builds where null query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND test_id IS NULL";

                    expect(result).toBe(expectedResult);
                });

                test("Builds where null query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereNotNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND test_id IS NOT NULL";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Or Where null/Or not null", () => {
                test("orWhereNull: Builds where null query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' OR test_id IS NULL";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotNull: Builds where null query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereNotNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' OR test_id IS NOT NULL";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where Any/Where All", () => {
                test("whereAny: Builds where query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereAny([
                            'name',
                            'email',
                            'phone',
                        ], 'LIKE', 'Example%')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND (`name` LIKE 'Example%' OR `email` LIKE 'Example%' OR `phone` LIKE 'Example%')";

                    expect(result).toBe(expectedResult);
                });

                test("whereAll: Builds where query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereAll([
                            'name',
                            'email',
                            'phone',
                        ], 'LIKE', 'Example%')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND (`name` LIKE 'Example%' AND `email` LIKE 'Example%' AND `phone` LIKE 'Example%')";

                    expect(result).toBe(expectedResult);
                });

                test("whereNone: Builds where query string", () => {
                    const result = new Query()
                        .from('my_table')
                        .where('test_name', '=', 'John')
                        .whereNone([
                            'name',
                            'email',
                            'phone',
                        ], 'LIKE', 'Example%')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_name` = 'John' AND NOT (name LIKE 'Example%' OR email LIKE 'Example%' OR phone LIKE 'Example%')";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Or Where", () => {
                test("Does not add or if orWhere is called without an existing where", () => {
                    const result = Query.from('my_table')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `test_id` = 5";

                    expect(result).toBe(expectedResult);
                });

                test("Adds or in query with where before", () => {
                    const result = Query.from('my_table')
                        .where('name', '=', 'John')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `name` = 'John' OR `test_id` = 5";

                    expect(result).toBe(expectedResult);
                });

                test("Operator defaults to equals when omitted", () => {
                    const result = Query.from('my_table')
                        .where('name', '=', 'John')
                        .orWhere('test_id', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `my_table` WHERE `name` = 'John' OR `test_id` = 5";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where in/not in", () => {
                test("Builds where in query string", () => {
                    const result = Query.from('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .whereIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE name IN ('John', 'James', 'Bob') AND id IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds or where in query string", () => {
                    const result = Query.from('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .orWhereIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE name IN ('John', 'James', 'Bob') OR id IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds where not in query string", () => {
                    const result = Query.from('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .whereNotIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE name IN ('John', 'James', 'Bob') AND id NOT IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds or where not in query string", () => {
                    const result = Query.from('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .orWhereNotIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE name IN ('John', 'James', 'Bob') OR id NOT IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where callback", () => {
                describe("Where", () => {
                    test("It groups where statement with callback", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .where(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .where('age', '>', 90)
                            .get();

                        const expectedResult = "SELECT * FROM `users` WHERE (`name` = 'John' OR `id` > 1) AND `age` > 90";

                        expect(result).toBe(expectedResult);
                    });

                    test("It can correctly add grouped where with an existing where", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .where('age', '>', 90)
                            .where(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .orWhere('position', '=', 'accountant')
                            .get();

                        const expectedResult = "SELECT * FROM `users` WHERE `age` > 90 AND (`name` = 'John' OR `id` > 1) OR `position` = 'accountant'";

                        expect(result).toBe(expectedResult);
                    });
                });

                describe("Or Where", () => {
                    test("It groups or where statement with callback in typical use case", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .where('age', '>', 90)
                            .orWhere(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .get();

                        const expectedResult = "SELECT * FROM `users` WHERE `age` > 90 OR (`name` = 'John' OR `id` > 1)";

                        expect(result).toBe(expectedResult);
                    });

                    test("It groups or where statement with callback when only single where statement", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .orWhere(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .get();

                        const expectedResult = "SELECT * FROM `users` WHERE (`name` = 'John' OR `id` > 1)";

                        expect(result).toBe(expectedResult);
                    });
                })
            });

            describe("Where between/not between", () => {
                test("It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .whereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 AND age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .whereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where or between/or not between", () => {
                test("orWhereBetween: It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 OR age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereBetween: It does not add the OR if there is no previous where query", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .orWhereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotBetween: It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 OR age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotBetween: It does not add the OR if there is no previous where query", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .orWhereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where column/where between columns/where not between columns", () => {
                test("whereColumn", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .whereColumn('created_at', 'updated_at')
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 AND created_at = updated_at";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereColumn", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereColumn('created_at', 'updated_at')
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 OR created_at = updated_at";

                    expect(result).toBe(expectedResult);
                });

                test("whereBetweenColumns", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .whereBetweenColumns('created_at', ['updated_at', 'deleted_at'])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 AND created_at >= updated_at AND created_at <= deleted_at";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereBetweenColumns", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereBetweenColumns('created_at', ['updated_at', 'deleted_at'])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 OR created_at >= updated_at AND created_at <= deleted_at";

                    expect(result).toBe(expectedResult);
                });

                test("WhereNotBetweenColumns", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .whereNotBetweenColumns('created_at', ['updated_at', 'deleted_at'])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 AND created_at < updated_at AND created_at > deleted_at";

                    expect(result).toBe(expectedResult);
                });

                test("OrWhereNotBetweenColumns", () => {
                    const result = Query
                        .from('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereNotBetweenColumns('created_at', ['updated_at', 'deleted_at'])
                        .get();

                    const expectedResult = "SELECT * FROM `users` WHERE `id` > 1 OR created_at < updated_at AND created_at > deleted_at";

                    expect(result).toBe(expectedResult);
                });
            });
        });

        describe("Select", () => {
            test("Select query string", () => {
                const result = new Query()
                    .from('test_models')
                    .select('test_id', 'test_name')
                    .toSql()
                    .get();

                const expectedResult = "SELECT `test_id`, `test_name` FROM `test_models`";

                expect(result).toBe(expectedResult);
            });

            describe("Distinct:", () => {
                test("it builds select statement with distinct", () => {
                    const result = new Query()
                        .from('test_models')
                        .distinct()
                        .select('test_id', 'test_name')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT DISTINCT `test_id`, `test_name` FROM `test_models`";

                    expect(result).toBe(expectedResult);
                });

                test("it does not DISTINCT when there is no specified select", () => {
                    const result = new Query()
                        .from('test_models')
                        .distinct()
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM `test_models`";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Select Raw:", () => {
                test("Builds query string with binding", () => {
                    const result = new Query()
                        .from('test_models')
                        .select('test_id', 'test_name')
                        .selectRaw('price * ? as price_with_tax', [1.0825])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT `test_id`, `test_name`, price * 1.0825 as price_with_tax FROM `test_models`";

                    expect(result).toBe(expectedResult);
                });

                test("Builds query string without binding", () => {
                    const result = new Query()
                        .from('test_models')
                        .select('test_id', 'test_name')
                        .selectRaw('price as price_with_tax')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT `test_id`, `test_name`, price as price_with_tax FROM `test_models`";

                    expect(result).toBe(expectedResult);
                });
            });
        });

        describe("Join", () => {
            test('builds query to join a table', () => {
                const result = new Query()
                    .from('users')
                    .select('users.id', 'users.name', 'posts.title')
                    .join('posts', 'users.id', '=', 'posts.user_id')
                    .toSql()
                    .get();

                const expectedResult = "SELECT `users`.`id`, `users`.`name`, `posts`.`title` FROM `users` INNER JOIN posts ON users.id = posts.user_id";

                expect(result).toBe(expectedResult);
            });

            test('builds query with multiple joins', () => {
                const result = new Query()
                    .from('users')
                    .select('users.id', 'users.name', 'posts.title')
                    .join('posts', 'users.id', '=', 'posts.user_id')
                    .join('comments', 'users.id', '=', 'comments.user_id')
                    .toSql()
                    .get();

                const expectedResult = "SELECT `users`.`id`, `users`.`name`, `posts`.`title` FROM `users` INNER JOIN posts ON users.id = posts.user_id INNER JOIN comments ON users.id = comments.user_id";

                expect(result).toBe(expectedResult);
            });

            describe('Left Join', () => {
                test('builds query to left join a table', () => {
                    const result = new Query()
                        .from('users')
                        .select('users.id', 'users.name', 'posts.title')
                        .leftJoin('posts', 'users.id', '=', 'posts.user_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT `users`.`id`, `users`.`name`, `posts`.`title` FROM `users` LEFT JOIN posts ON users.id = posts.user_id";

                    expect(result).toBe(expectedResult);
                });
            });

            describe('Cross Join', () => {
                test('builds query to cross join a table', () => {
                    const result = new Query()
                        .from('users')
                        .select('users.id', 'users.name', 'posts.title')
                        .crossJoin('comments')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT `users`.`id`, `users`.`name`, `posts`.`title` FROM `users` CROSS JOIN comments";

                    expect(result).toBe(expectedResult);
                });
            });
        });

        describe("Order by", () => {
            test("Order by query string", () => {
                const result = new Query()
                    .from('my_table')
                    .orderBy('test_id')
                    .orderBy('test_name', 'ASC')
                    .orderByDesc('name')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM `my_table` ORDER BY test_id DESC, test_name ASC, name DESC";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Group by", () => {
            test("Group by query string", () => {
                const result = new Query()
                    .from('my_table')
                    .groupBy('test_id', 'test_name')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `my_table` GROUP BY test_id, test_name");
            });

            test("Group by raw query string", () => {
                const result = new Query()
                    .from('my_table')
                    .groupBy('test_id', 'test_name')
                    .groupByRaw('role, location')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `my_table` GROUP BY test_id, test_name, role, location");
            });
        });

        describe("Having", () => {
            test("Having query string", () => {
                const result = new Query()
                    .from('my_table')
                    .having('test_id', 5)
                    .having('test_name', '=', 'test')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `my_table` HAVING test_id = 5 AND test_name = 'test'");
            });

            describe("Having Raw", () => {
                test("Having raw query string", () => {
                    const result = new Query()
                        .from('orders')
                        .having('name', '=', 'test')
                        .havingRaw('SUM(price) > ?', [2500])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM `orders` HAVING name = 'test' AND SUM(price) > 2500");
                });

                test("Having raw query string with multiple values", () => {
                    const result = new Query()
                        .from('orders')
                        .having('name', '=', 'test')
                        .havingRaw('SUM(price) > ? AND SUM(price) < ? AND description = ?', [2500, 5000, "test"])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM `orders` HAVING name = 'test' AND SUM(price) > 2500 AND SUM(price) < 5000 AND description = 'test'");
                });
            });

            describe("orHaving/orHavingRaw", () => {
                describe("OrHaving", () => {
                    test("Or Having with a previous statement statement", () => {
                        const result = new Query()
                            .from('my_table')
                            .having('test_id', '=', 5)
                            .orHaving('test_name', 'test')
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM `my_table` HAVING test_id = 5 OR test_name = 'test'");
                    });

                    test("Doesn't apply Or when no previous having statement", () => {
                        const result = new Query()
                            .from('my_table')
                            .orHaving('test_name', '=', 'test')
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM `my_table` HAVING test_name = 'test'");
                    });
                });

                describe("OrHavingRaw", () => {
                    test("Or Having Raw with a previous statement", () => {
                        const result = new Query()
                            .from('my_table')
                            .having('test_id', '=', 5)
                            .orHavingRaw('SUM(price) > ?', [2500])
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM `my_table` HAVING test_id = 5 OR SUM(price) > 2500");
                    });

                    test("Doesn't apply Or when no previous having raw statement", () => {
                        const result = new Query()
                            .from('my_table')
                            .orHavingRaw('SUM(price) > ?', [2500])
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM `my_table` HAVING SUM(price) > 2500");
                    });
                });
            });

            describe("HavingBetween/OrHavingBetween", () => {
                test("Having between query string", () => {
                    const result = new Query()
                        .from('orders')
                        .having('name', '=', 'test')
                        .havingBetween('orders', [5, 15])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM `orders` HAVING name = 'test' AND orders BETWEEN 5 AND 15");
                });

                test("Or Having between query string", () => {
                    const result = new Query()
                        .from('orders')
                        .having('name', '=', 'test')
                        .orHavingBetween('orders', [5, 15])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM `orders` HAVING name = 'test' OR orders BETWEEN 5 AND 15");
                });
            });

            describe("Having callback", () => {
                describe("Having", () => {
                    test("It groups 'HAVING' statement with callback", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .groupBy('account_id')
                            .having(($query) => {
                                $query
                                    .having("account_id", '>', 100)
                                    .havingBetween("order_count", [5, 15])
                                    .orHaving("purchase_count", 5);
                            })
                            .get();

                        const expectedResult = [
                            "SELECT * FROM `users`",
                            "GROUP BY account_id",
                            "HAVING (account_id > 100 AND order_count BETWEEN 5 AND 15 OR purchase_count = 5)"
                        ];

                        expect(result).toBe(expectedResult.join(" "));
                    });

                    test("It can correctly add grouped 'HAVING' with an existing 'HAVING'", () => {
                        const result = Query
                            .from("users")
                            .toSql()
                            .groupBy("account_id")
                            .having('age', '>', 90)
                            .having(($query) => {
                                $query
                                    .having("account_id", '>', 100)
                                    .havingBetween("order_count", [5, 15])
                                    .orHaving("purchase_count", 5);
                            })
                            .orHaving('size', 'xl')
                            .get();

                        const expectedResult = [
                            "SELECT * FROM `users`",
                            "GROUP BY account_id",
                            "HAVING age > 90",
                            "AND (account_id > 100 AND order_count BETWEEN 5 AND 15 OR purchase_count = 5)",
                            "OR size = 'xl'"
                        ];

                        expect(result).toBe(expectedResult.join(" "));
                    });
                });

                describe("Or Having", () => {
                    test("It groups 'OR HAVING' statement with callback in typical use case", () => {
                        const result = Query
                            .from("users")
                            .toSql()
                            .groupBy("account_id")
                            .having('age', '>', 90)
                            .orHaving(($query) => {
                                $query
                                    .having("account_id", '>', 100)
                                    .havingBetween("order_count", [5, 15])
                                    .orHaving("purchase_count", 5);
                            })
                            .having('size', 'xl')
                            .get();

                        const expectedResult = [
                            "SELECT * FROM `users`",
                            "GROUP BY account_id",
                            "HAVING age > 90",
                            "OR (account_id > 100 AND order_count BETWEEN 5 AND 15 OR purchase_count = 5)",
                            "AND size = 'xl'"
                        ];

                        expect(result).toBe(expectedResult.join(" "));
                    });

                    test("It groups 'OR HAVING' statement with callback when only single 'HAVING' statement", () => {
                        const result = Query
                            .from('users')
                            .toSql()
                            .groupBy('account_id')
                            .orHaving(($query) => {
                                $query
                                    .having("account_id", '>', 100)
                                    .havingBetween("order_count", [5, 15])
                                    .orHaving("purchase_count", 5);
                            })
                            .get();

                        const expectedResult = [
                            "SELECT * FROM `users`",
                            "GROUP BY account_id",
                            "HAVING (account_id > 100 AND order_count BETWEEN 5 AND 15 OR purchase_count = 5)"
                        ];

                        expect(result).toBe(expectedResult.join(" "));
                    });
                })
            });
        });

        describe("Limit", () => {
            test("Limit query string", () => {
                const result = new Query()
                    .from('my_table')
                    .limit(1)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `my_table` LIMIT 1");
            });
        });

        describe("First", () => {
            test("First query string", () => {
                const result = new Query()
                    .from('my_table')
                    .toSql()
                    .first();

                expect(result).toBe("SELECT * FROM `my_table` LIMIT 1");
            });
        });

        describe("Offset", () => {
            test("Offset query string", () => {
                const result = Query
                    .from("users")
                    .offset(5)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM `users` OFFSET 5")
            });
        });

        describe("Insert", () => {
            test("Insert query string", async () => {
                const fields = {
                    name: 'john',
                    address: '123 Taco Lane Ave St'
                }

                const result = await Query.toSql().from('users').insert(fields);

                expect(result).toBe("INSERT INTO users (name, address) VALUES ('john', '123 Taco Lane Ave St')");
            });
        });

        describe("Update", () => {
            test("Builds full update query string", () => {
                const fields = {
                    name: 'john',
                    address: '123 Taco Lane Ave St'
                }

                const result = Query
                    .toSql()
                    .from('users')
                    .where('id', '=', 5)
                    .limit(5)
                    .offset(5)
                    .update(fields);

                expect(result).toBe("UPDATE users SET name = 'john', address = '123 Taco Lane Ave St' WHERE `id` = 5 LIMIT 5 OFFSET 5");
            })
        });

        describe("Delete", () => {
            test("Builds full delete query string", () => {
                const result = Query
                    .toSql()
                    .from('users')
                    .orderBy('name', "ASC")
                    .where('name', '=', 'john')
                    .limit(1)
                    .offset(1)
                    .delete();

                expect(result).toBe("DELETE FROM users WHERE `name` = 'john' ORDER BY name ASC LIMIT 1 OFFSET 1");
            })
        })
    });

    describe("Validation", () => {
        describe("Comparison Operators", () => {
            const operators = [
                [null, false],
                [1, false],
                [[], false],
                [{}, false],
                ["o", false],
                ["taco", false],
                ["!", false],
                ["===", false],
                ["==", true],
                ["=", true],
                ["!=", true],
                ["<>", true],
                [">", true],
                ["<", true],
                [">=", true],
                ["<=", true],
                ["!<", true],
                ["!>", true],
            ];

            test.each(operators)('validating that %s is %s', (operator, isValid) => {
                if (!isValid) {
                    expect(() => Query.from("users").join("posts", 'id', operator, 'id')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").where("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").orWhere("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").having("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").orHaving("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").whereColumn("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                } else {
                    expect(() => Query.from("users").join("posts", 'id', operator, 'id')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").where("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").orWhere("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").having("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").orHaving("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.from("users").whereColumn("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                }
            });
        });

        describe("Improper array length", () => {
            const arrays = [
                [[], false],
                [{}, false],
                [["one"], false],
                [["one", "two", "three"], false],
                [null, false],
                ["taco", false],
                [["one", "two"], true],
            ];

            test.each(arrays)('validating that %s is %s', (arrayValues, isValid) => {
                if (!isValid) {
                    expect(() => Query.from("users").whereBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereNotBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereNotBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereBetweenColumns("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereBetweenColumns("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereNotBetweenColumns("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereNotBetweenColumns("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").havingBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orHavingBetween("name", arrayValues)).toThrow(InvalidBetweenValueArrayLength)
                } else {
                    expect(() => Query.from("users").whereBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereNotBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereNotBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereBetweenColumns("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereBetweenColumns("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").whereNotBetweenColumns("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orWhereNotBetweenColumns("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").havingBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                    expect(() => Query.from("users").orHavingBetween("name", arrayValues)).not.toThrow(InvalidBetweenValueArrayLength)
                }
            });
        })
    });

    describe("Execute Queries", () => {
        describe("Insert", () => {
            test("It binds and executes query", async () => {
                //DB.insert returns { stmt: Statement { stmt: undefined }, lastID: 17, changes: 1 }
                const insertReturn = {lastID: 17, changes: 1};
                DB.prototype.insert.mockResolvedValue(insertReturn);

                const table = "users";
                const expectedQuery = "INSERT INTO users (name, age, sex) VALUES (?, ?, ?)";
                const expectedBindings = ['John', 20, 'M'];

                const query = await Query
                    .from(table)
                    .insert({
                        'name': 'John',
                        'age': 20,
                        'sex': 'M',
                    });

                expect(query).toEqual(true);
                expect(DB.prototype.insert).toHaveBeenCalledOnce();
                expect(DB.prototype.insert).toHaveBeenCalledWith(expectedQuery, expectedBindings);
            });
        });
    })
});