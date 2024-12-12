import {describe, expect, test} from 'vitest';
import {QueryBuilder} from "../src/QueryBuilder.js";
import {TableNotSetError} from "../src/errors/QueryBuilder/Errors.js";

describe("QueryBuilderTest", () => {
    describe("Building Query Strings", () => {
        describe("To Sql", () => {
            test("Base query string", () => {
                const result = new QueryBuilder()
                    .table('my_table')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table");
            });

            describe("Throws when table is not set", () => {
                test("Get", () => {
                    expect(() => new QueryBuilder().get()).toThrow(TableNotSetError);
                });

                test("First", () => {
                    expect(() => new QueryBuilder().first()).toThrow(TableNotSetError);
                });

                test("Insert", () => {
                    expect(() => new QueryBuilder().insert({taco:'tuesday'})).toThrow(TableNotSetError);
                });

                test("Update", () => {
                    expect(() => new QueryBuilder().update({taco:'tuesday'})).toThrow(TableNotSetError);
                });
            })


            test("Select", () => {
                const result = QueryBuilder
                    .table('my_table')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM my_table";

                expect(result).toBe(expectedResult);
            });

            test("builds full query in correct order", () => {
                const result = QueryBuilder.toSql()
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
                const result = new QueryBuilder()
                    .table('my_table')
                    .where('test_id', '=', 5)
                    .where('test_name', '=', 'John')
                    .toSql()
                    .get();

                const expectedResult = "SELECT * FROM my_table WHERE test_id = 5 AND test_name = 'John'";

                expect(result).toBe(expectedResult);
            });

            describe("Or Where", () => {
                test("Does not add or if orWhere is called without an existing where", () => {
                    const result = QueryBuilder.table('my_table')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE test_id = 5";

                    expect(result).toBe(expectedResult);
                });

                test("Adds or in query with where before", () => {
                    const result = QueryBuilder.table('my_table')
                        .where('name', '=', 'John')
                        .orWhere('test_id', '=', 5)
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM my_table WHERE name = 'John' OR test_id = 5";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where in", () => {
                test("Builds where in query string", () => {
                    const result = QueryBuilder.table('users')
                        .whereIn('name', ['John', 'James', 'Bob'])
                        .whereIn('id', [1, 5, 7])
                        .toSql()
                        .get();

                    const expectedResult = "SELECT * FROM users WHERE name IN ('John', 'James', 'Bob') AND id IN (1, 5, 7)";

                    expect(result).toBe(expectedResult);
                });
            });

            describe("Where callback", () => {
                test("It groups where statement with callback", () => {
                    const result = QueryBuilder
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
                    const result = QueryBuilder
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
            })
        });

        describe("Select", () => {
            test("Select query string", () => {
                const result = new QueryBuilder()
                    .table('test_models')
                    .select('test_id', 'test_name')
                    .toSql()
                    .get();

                const expectedResult = "SELECT test_id, test_name FROM test_models";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Order by", () => {
            test("Order by query string", () => {
                const result = new QueryBuilder()
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
                const result = new QueryBuilder()
                    .table('my_table')
                    .groupBy('test_id', 'test_name')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table GROUP BY test_id, test_name");
            });
        });

        describe("Having", () => {
            test("Having query string", () => {
                const result = new QueryBuilder()
                    .table('my_table')
                    .having('test_id', '=', 5)
                    .having('test_name', '=', 'test')
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table HAVING test_id = 5 AND test_name = 'test'");
            });
        });

        describe("Limit", () => {
            test("Limit query string", () => {
                const result = new QueryBuilder()
                    .table('my_table')
                    .limit(1)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM my_table LIMIT 1");
            });
        });

        describe("First", () => {
            test("First query string", () => {
                const result = new QueryBuilder()
                    .table('my_table')
                    .toSql()
                    .first();

                expect(result).toBe("SELECT * FROM my_table LIMIT 1");
            });
        });

        describe("Offset", () => {
            test("Offset query string", () => {
                const result = QueryBuilder
                    .table("users")
                    .offset(5)
                    .toSql()
                    .get();

                expect(result).toBe("SELECT * FROM users OFFSET 5")
            });
        });

        describe("Insert", () => {
            test("Insert query string", () => {
                const fields = {
                    name: 'john',
                    address: '123 Taco Lane Ave St'
                }

                const result = QueryBuilder
                    .toSql()
                    .table('users')
                    .insert(fields);

                expect(result).toBe("INSERT INTO users (name, address) VALUES ('john', '123 Taco Lane Ave St')");
            });
        });

        describe("Update", () => {
            test("Builds full update query string", () => {
                const fields = {
                    name: 'john',
                    address: '123 Taco Lane Ave St'
                }

                const result = QueryBuilder
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
                const result = QueryBuilder
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

    // describe("Building Prepare Statement", () => {
    //     const table = 'users';
    //
    //     describe('insert', () => {
    //         test('insert statement', () => {
    //             const fields = {
    //                 name: 'john',
    //                 address: '123 Taco Lane Ave St'
    //             }
    //
    //             const result = QueryBuilder
    //                 .table(table)
    //                 .insert(fields)
    //                 .toStatement();
    //
    //             expect(result.statement).toEqual("INSERT INTO users (:name, :address)")
    //             expect(result.bindings).toEqual({
    //                 ':name': fields.name,
    //                 ':address': fields.address,
    //             })
    //         });
    //
    //     });
    // });
});