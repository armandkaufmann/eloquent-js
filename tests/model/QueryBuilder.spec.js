import {describe, expect, test} from 'vitest';
import {QueryBuilder} from "../../src/model/QueryBuilder.js";

describe("QueryBuilderTest", () => {
    describe("Building Query Strings", () => {
        describe("To Sql", () => {
            test("Base query string", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .toSql();

                expect(result).toBe("SELECT * FROM my_table");
            });

            test('throws when table is not set', () => {
                expect(() => new QueryBuilder().toSql()).toThrow();
            });

            test("Select", () => {
                const result = QueryBuilder
                    .table('my_table')
                    .toSql();

                const expectedResult = "SELECT * FROM my_table";

                expect(result).toBe(expectedResult);
            });

            test("builds full query in correct order", () => {
                const result = QueryBuilder.table('my_table')
                    .where('name', '=', 'John')
                    .select('id', 'name')
                    .limit(2)
                    .groupBy('class')
                    .orderBy('id')
                    .having('class', 'LIKE', '%example%')
                    .toSql();

                const expectedResult = "SELECT id, name FROM my_table WHERE name = 'John' GROUP BY class HAVING class LIKE '%example%' ORDER BY id DESC LIMIT 2"

                expect(result).toBe(expectedResult);
            });

        });

        describe("Where", () => {
            test("Query String", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .where('test_id', '=', 5)
                    .where('test_name', '=', 'John')
                    .toSql();

                const expectedResult = "SELECT * FROM my_table WHERE test_id = 5 AND test_name = 'John'";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Select", () => {
            test("Select query string", () => {
                const result = new QueryBuilder()
                    .from('test_models')
                    .select('test_id', 'test_name')
                    .toSql();

                const expectedResult = "SELECT test_id, test_name FROM test_models";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Order by", () => {
            test("Order by query string", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .orderBy('test_id')
                    .orderBy('test_name', 'ASC')
                    .toSql();


                const expectedResult = "SELECT * FROM my_table ORDER BY test_id DESC, test_name ASC";

                expect(result).toBe(expectedResult);
            });
        });

        describe("Group by", () => {
            test("Group by query string", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .groupBy('test_id', 'test_name')
                    .toSql();

                expect(result).toBe("SELECT * FROM my_table GROUP BY test_id, test_name");
            });
        });

        describe("Having", () => {
            test("Having query string", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .having('test_id', '=', 5)
                    .having('test_name', '=', 'test')
                    .toSql();

                expect(result).toBe("SELECT * FROM my_table HAVING test_id = 5 AND test_name = 'test'");
            });
        });

        describe("Limit", () => {
            test("Limit query string", () => {
                const result = new QueryBuilder()
                    .from('my_table')
                    .limit(1)
                    .toSql();

                expect(result).toBe("SELECT * FROM my_table LIMIT 1");
            });
        });

    });
});