import {test, describe} from "node:test";
import assert from "node:assert/strict";
import {QueryBuilder} from "../../src/model/QueryBuilder.js";

describe('QueryBuilderTest', () => {
    describe('Building Query Strings', () => {
        describe('Where', () => {
            test("Query String", () => {
                const result = new QueryBuilder()
                    .where('test_id', '=', 5)
                    .where('test_name', '=', 'John')
                    ._buildWhereQuery();


                const expectedResult = "WHERE test_id = 5 AND test_name = 'John'";

                assert.equal(result, expectedResult);
            });

            test("Empty where query string", () => {
                const result = new QueryBuilder()
                    ._buildWhereQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Select', () => {
            test("Select query string", () => {
                const result = new QueryBuilder()
                    .from('test_models')
                    .select('test_id', 'test_name')
                    ._buildSelectQuery();

                const expectedResult = "SELECT test_id, test_name FROM test_models";

                assert.equal(result, expectedResult);
            });

            test("Empty select query string", () => {
                const result = new QueryBuilder()
                    .from('test_models')
                    ._buildSelectQuery();


                const expectedResult = "SELECT * FROM test_models";

                assert.equal(result, expectedResult);
            });
        });

        describe('Order by', () => {
            test("Order by query string", () => {
                const result = new QueryBuilder()
                    .orderBy('test_id')
                    .orderBy('test_name', 'ASC')
                    ._buildOrderByQuery();


                const expectedResult = "ORDER BY test_id DESC, test_name ASC";

                assert.equal(result, expectedResult);
            });

            test("Empty order by query string", () => {
                const result = new QueryBuilder()
                    ._buildOrderByQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Group by', () => {
            test("Group by query string", () => {
                const result = new QueryBuilder()
                    .groupBy('test_id', 'test_name')
                    ._buildGroupByQuery();

                const expectedResult = "GROUP BY test_id, test_name";

                assert.equal(result, expectedResult);
            });

            test("Empty group by query string", () => {
                const result = new QueryBuilder()
                    ._buildGroupByQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Having', () => {
            test("Having query string", () => {
                const result = new QueryBuilder()
                    .having('test_id', '=', 5)
                    .having('test_name', '=', 'test')
                    ._buildHavingQuery();

                const expectedResult = "HAVING test_id = 5 AND test_name = 'test'";

                assert.equal(result, expectedResult);
            });

            test("Empty having query string", () => {
                const result = new QueryBuilder()
                    ._buildHavingQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Limit', () => {
            test("Limit query string", () => {
                const result = new QueryBuilder()
                    .limit(1)
                    ._buildLimitQuery();

                const expectedResult = "LIMIT 1";

                assert.equal(result, expectedResult);
            });

            test("Empty limit query string", () => {
                const result = new QueryBuilder()
                    ._buildLimitQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

    });

    describe('toSql', () => {
        test('Select', () => {
            const result = QueryBuilder.table('my_table')
                .toSql();

            const expectedResult = "SELECT * FROM my_table";

            assert.equal(result, expectedResult);
        });
    });

    test('builds full query in correct order', () => {
        const result = QueryBuilder.table('my_table')
            .select('id', 'name')
            .where('name', '=', 'John')
            .groupBy('class')
            .having('class', 'LIKE', '%example%')
            .orderBy('id')
            .limit(2)
            .toSql();

        const expectedResult = "SELECT id, name FROM my_table WHERE name = 'John' GROUP BY class HAVING class LIKE '%example%' ORDER BY id DESC LIMIT 2"

        assert.equal(result, expectedResult);
    });
});