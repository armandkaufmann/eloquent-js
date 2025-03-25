import {describe, expect, beforeEach, test, vi} from 'vitest';
import {Query} from "../../src/builder/Query.js";
import {InvalidComparisonOperatorError, TableNotSetError} from "../../src/errors/QueryBuilder/Errors.js";
import {DB} from "../../src/DB.js";
import {DatabaseNotFoundError} from "../../src/errors/DB/Errors.js";

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
                    .table('my_table')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table");
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
                    .table('my_table')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM my_table";

                expect(result).toBe(expectedResult);
            });

            test("builds full query in correct order", () => {
                const result = Query.toSql()
                    .table('my_table')
                    .where('name', '=', 'John')
                    .select('id', 'name')
                    .limit(2)
                    .groupBy('class')
                    .offset(5)
                    .orderBy('id')
                    .having('class', 'LIKE', '%example%')
                    .get();

                const expectedResult = "SELECT id, name FROM my_table WHERE name = 'John' GROUP BY class HAVING class LIKE '%example%' ORDER BY id DESC LIMIT 2 OFFSET 5"

                expect(result).toBe(expectedResult);
            });
        });

        describe("Where", () => {
            test("Query String", () => {
                const result = new Query()
                    .table('my_table')
                    .where('test_id', '=', 5)
                    .where('test_name', '=', 'John')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM my_table WHERE test_id = 5 AND test_name = 'John'";

                expect(result).toBe(expectedResult);
            });

            test("Operator defaults to equals when omitted", () => {
                const result = new Query()
                    .table('my_table')
                    .where('test_id', 5)
                    .where('test_name', 'John')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM my_table WHERE test_id = 5 AND test_name = 'John'";

                expect(result).toBe(expectedResult);
            });

            describe("Where null/not null", () => {
                test("Builds where null query string", () => {
                    const result = new Query()
                        .table('my_table')
                        .where('test_name', '=', 'John')
                        .whereNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_name = 'John' AND test_id IS NULL";

                    expect(result).toBe(expectedResult);
                });

                test("Builds where null query string", () => {
                    const result = new Query()
                        .table('my_table')
                        .where('test_name', '=', 'John')
                        .whereNotNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_name = 'John' AND test_id IS NOT NULL";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Or Where null/Or not null", () => {
                test("orWhereNull: Builds where null query string", () => {
                    const result = new Query()
                        .table('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_name = 'John' OR test_id IS NULL";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotNull: Builds where null query string", () => {
                    const result = new Query()
                        .table('my_table')
                        .where('test_name', '=', 'John')
                        .orWhereNotNull('test_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_name = 'John' OR test_id IS NOT NULL";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Or Where", () => {
                test("Does not add or if orWhere is called without an existing where", () => {
                    const result = Query.table('my_table')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_id = 5";

                    expect(result).toBe(expectedResult);
                });

                test("Adds or in query with where before", () => {
                    const result = Query.table('my_table')
                        .where('name', '=', 'John')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE name = 'John' OR test_id = 5";

                    expect(result).toBe(expectedResult);
                });

                test("Operator defaults to equals when omitted", () => {
                    const result = Query.table('my_table')
                        .where('name', '=', 'John')
                        .orWhere('test_id', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE name = 'John' OR test_id = 5";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where in/not in", () => {
                test("Builds where in query string", () => {
                    const result = Query.table('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .whereIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE name IN ('John', 'James', 'Bob') AND id IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds or where in query string", () => {
                    const result = Query.table('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .orWhereIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE name IN ('John', 'James', 'Bob') OR id IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds where not in query string", () => {
                    const result = Query.table('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .whereNotIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE name IN ('John', 'James', 'Bob') AND id NOT IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });

                test("Builds or where not in query string", () => {
                    const result = Query.table('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .orWhereNotIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE name IN ('John', 'James', 'Bob') OR id NOT IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where callback", () => {
                describe("Where", () => {
                    test("It groups where statement with callback", () => {
                        const result = Query
                            .table('users')
                            .toSql()
                            .where(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .where('age', '>', 90)
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE (name = 'John' OR id > 1) AND age > 90";

                        expect(result).toBe(expectedResult);
                    });

                    test("It can correctly add grouped where with an existing where", () => {
                        const result = Query
                            .table('users')
                            .toSql()
                            .where('age', '>', 90)
                            .where(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .orWhere('position', '=', 'accountant')
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE age > 90 AND (name = 'John' OR id > 1) OR position = 'accountant'";

                        expect(result).toBe(expectedResult);
                    });
                });

                describe("Or Where", () => {
                    test("It groups or where statement with callback in typical use case", () => {
                        const result = Query
                            .table('users')
                            .toSql()
                            .where('age', '>', 90)
                            .orWhere(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE age > 90 OR (name = 'John' OR id > 1)";

                        expect(result).toBe(expectedResult);
                    });

                    test("It groups or where statement with callback when only single where statement", () => {
                        const result = Query
                            .table('users')
                            .toSql()
                            .orWhere(($query) => {
                                $query
                                    .where('name', '=', 'John')
                                    .orWhere('id', '>', 1);
                            })
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE (name = 'John' OR id > 1)";

                        expect(result).toBe(expectedResult);
                    });
                })
            });

            describe("Where between/not between", () => {
                test("It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .where('id', '>', 1)
                        .whereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE id > 1 AND age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .whereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where or between/or not between", () => {
                test("orWhereBetween: It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE id > 1 OR age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereBetween: It does not add the OR if there is no previous where query", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .orWhereBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE age BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotBetween: It groups or where statement with callback in typical use case", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .where('id', '>', 1)
                        .orWhereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE id > 1 OR age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });

                test("orWhereNotBetween: It does not add the OR if there is no previous where query", () => {
                    const result = Query
                        .table('users')
                        .toSql()
                        .orWhereNotBetween('age', [18, 25])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE age NOT BETWEEN 18 AND 25";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("WhereBetweenColumns & WhereNotBetweenColumns", () => {
                test("whereBetweenColumns: Builds query string", () => {
                    const result = Query
                        .table("users")
                        .toSql()
                        .where("id", '>', 1)
                        .whereBetweenColumns("age", ["max_age", "min_age"])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE id > 1 AND age BETWEEN max_age AND min_age";

                    expect(result).toBe(expectedResult);
                });

                test("whereNotBetweenColumns: Builds query string", () => {
                    const result = Query
                        .table("users")
                        .toSql()
                        .where("id", '>', 1)
                        .whereNotBetweenColumns("age", ["max_age", "min_age"])
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE id > 1 AND age NOT BETWEEN max_age AND min_age";

                    expect(result).toBe(expectedResult);
                });

                describe("OrWhereBetweenColumns & OrWhereNotBetweenColumns", () => {
                    test("orWhereBetweenColumns: Builds query string", () => {
                        const result = Query
                            .table("users")
                            .toSql()
                            .where("id", '>', 1)
                            .orWhereBetweenColumns("age", ["max_age", "min_age"])
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE id > 1 OR age BETWEEN max_age AND min_age";

                        expect(result).toBe(expectedResult);
                    });

                    test("orWhereBetweenColumns: Does not add or if there is no previous where", () => {
                        const result = Query
                            .table("users")
                            .toSql()
                            .orWhereBetweenColumns("age", ["max_age", "min_age"])
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE age BETWEEN max_age AND min_age";

                        expect(result).toBe(expectedResult);
                    });

                    test("orWhereNotBetweenColumns: Builds query string", () => {
                        const result = Query
                            .table("users")
                            .toSql()
                            .where("id", '>', 1)
                            .orWhereNotBetweenColumns("age", ["max_age", "min_age"])
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE id > 1 OR age NOT BETWEEN max_age AND min_age";

                        expect(result).toBe(expectedResult);
                    });

                    test("orWhereNotBetweenColumns: Does not add or if there is no previous where", () => {
                        const result = Query
                            .table("users")
                            .toSql()
                            .orWhereNotBetweenColumns("age", ["max_age", "min_age"])
                            .get();

                        const expectedResult = "SELECT * FROM users WHERE age NOT BETWEEN max_age AND min_age";

                        expect(result).toBe(expectedResult);
                    });
                });
            })
        });

        describe("Select", () => {
            test("Select query string", () => {
                const result = new Query()
                    .table('test_models')
                    .select('test_id', 'test_name')
                    .toSql()
                    .get();

                const expectedResult = "SELECT test_id, test_name FROM test_models";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Join", () => {
            test('builds query to join a table', () => {
                const result = new Query()
                    .table('users')
                    .select('users.id', 'users.name', 'posts.title')
                    .join('posts', 'users.id', '=', 'posts.user_id')
                    .toSql()
                    .get();

                const expectedResult = "SELECT users.id, users.name, posts.title FROM users INNER JOIN posts on users.id = posts.user_id";

                expect(result).toBe(expectedResult);
            });

            test('builds query with multiple joins', () => {
                const result = new Query()
                    .table('users')
                    .select('users.id', 'users.name', 'posts.title')
                    .join('posts', 'users.id', '=', 'posts.user_id')
                    .join('comments', 'users.id', '=', 'comments.user_id')
                    .toSql()
                    .get();

                const expectedResult = "SELECT users.id, users.name, posts.title FROM users INNER JOIN posts on users.id = posts.user_id INNER JOIN comments on users.id = comments.user_id";

                expect(result).toBe(expectedResult);
            });

            describe('Left Join', () => {
                test('builds query to left join a table', () => {
                    const result = new Query()
                        .table('users')
                        .select('users.id', 'users.name', 'posts.title')
                        .leftJoin('posts', 'users.id', '=', 'posts.user_id')
                        .toSql()
                        .get();

                    const expectedResult = "SELECT users.id, users.name, posts.title FROM users LEFT JOIN posts on users.id = posts.user_id";

                    expect(result).toBe(expectedResult);
                });
            });
        });

        describe("Order by", () => {
            test("Order by query string", () => {
                const result = new Query()
                    .table('my_table')
                    .orderBy('test_id')
                    .orderBy('test_name', 'ASC')
                    .toSql()
                    .get();


                const expectedResult = "SELECT * FROM my_table ORDER BY test_id DESC, test_name ASC";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Group by", () => {
            test("Group by query string", () => {
                const result = new Query()
                    .table('my_table')
                    .groupBy('test_id', 'test_name')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table GROUP BY test_id, test_name");
            });
        });

        describe("Having", () => {
            test("Having query string", () => {
                const result = new Query()
                    .table('my_table')
                    .having('test_id', '=', 5)
                    .having('test_name', '=', 'test')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table HAVING test_id = 5 AND test_name = 'test'");
            });

            describe("Having Raw", () => {
                test("Having raw query string", () => {
                    const result = new Query()
                        .table('orders')
                        .having('name', '=', 'test')
                        .havingRaw('SUM(price) > ?', [2500])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM orders HAVING name = 'test' AND SUM(price) > 2500");
                });

                test("Having raw query string with multiple values", () => {
                    const result = new Query()
                        .table('orders')
                        .having('name', '=', 'test')
                        .havingRaw('SUM(price) > ? AND SUM(price) < ? AND description = ?', [2500, 5000, "test"])
                        .toSql()
                        .get();

                    expect(result).toBe("SELECT * FROM orders HAVING name = 'test' AND SUM(price) > 2500 AND SUM(price) < 5000 AND description = 'test'");
                });
            });

            describe("orHaving/orHavingRaw", () => {
                describe("OrHaving", () => {
                    test("Or Having with a previous statement statement", () => {
                        const result = new Query()
                            .table('my_table')
                            .having('test_id', '=', 5)
                            .orHaving('test_name', '=', 'test')
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM my_table HAVING test_id = 5 OR test_name = 'test'");
                    });

                    test("Doesn't apply Or when no previous having statement", () => {
                        const result = new Query()
                            .table('my_table')
                            .orHaving('test_name', '=', 'test')
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM my_table HAVING test_name = 'test'");
                    });
                });

                describe("OrHavingRaw", () => {
                    test("Or Having Raw with a previous statement", () => {
                        const result = new Query()
                            .table('my_table')
                            .having('test_id', '=', 5)
                            .orHavingRaw('SUM(price) > ?', [2500])
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM my_table HAVING test_id = 5 OR SUM(price) > 2500");
                    });

                    test("Doesn't apply Or when no previous having raw statement", () => {
                        const result = new Query()
                            .table('my_table')
                            .orHavingRaw('SUM(price) > ?', [2500])
                            .toSql()
                            .get();

                        expect(result).toBe("SELECT * FROM my_table HAVING SUM(price) > 2500");
                    });
                });
            });
        });

        describe("Limit", () => {
            test("Limit query string", () => {
                const result = new Query()
                    .table('my_table')
                    .limit(1)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table LIMIT 1");
            });
        });

        describe("First", () => {
            test("First query string", () => {
                const result = new Query()
                    .table('my_table')
                    .toSql()
                    .first();

                expect(result).toBe("SELECT * FROM my_table LIMIT 1");
            });
        });

        describe("Offset", () => {
            test("Offset query string", () => {
                const result = Query
                    .table("users")
                    .offset(5)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM users OFFSET 5")
            });
        });

        describe("Insert", () => {
            test("Insert query string", async () => {
                const fields = {
                    name: 'john',
                    address: '123 Taco Lane Ave St'
                }

                const result = await Query.toSql().table('users').insert(fields);

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
                    .table('users')
                    .where('id', '=', 5)
                    .limit(5)
                    .offset(5)
                    .update(fields);

                expect(result).toBe("UPDATE users SET name = 'john', address = '123 Taco Lane Ave St' WHERE id = 5 LIMIT 5 OFFSET 5");
            })
        });

        describe("Delete", () => {
            test("Builds full delete query string", () => {
                const result = Query
                    .toSql()
                    .table('users')
                    .orderBy('name', "ASC")
                    .where('name', '=', 'john')
                    .limit(1)
                    .offset(1)
                    .delete();

                expect(result).toBe("DELETE FROM users WHERE name = 'john' ORDER BY name ASC LIMIT 1 OFFSET 1");
            })
        })
    });

    describe("Validation", () => {
        describe("Comparison Operators", () => {
            const operators = [
                [null, false],
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
                    expect(() => Query.table("users").join("posts", 'id', operator, 'id')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").where("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").orWhere("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").having("name", operator, 'John')).toThrow(InvalidComparisonOperatorError)
                } else {
                    expect(() => Query.table("users").join("posts", 'id', operator, 'id')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").where("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").orWhere("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                    expect(() => Query.table("users").having("name", operator, 'John')).not.toThrow(InvalidComparisonOperatorError)
                }
            });
        });
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
                    .table(table)
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