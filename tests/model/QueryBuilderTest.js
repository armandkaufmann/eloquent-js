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
                    .__buildWhereQuery();


                const expectedResult = "WHERE test_id = 5 AND test_name = 'John'";

                assert.equal(result, expectedResult);
            });

            test("Empty where query string", () => {
                const result = new QueryBuilder()
                    .__buildWhereQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Select', () => {
            test("Select query string", () => {
                const result = new QueryBuilder()
                    .from('test_models')
                    .select('test_id', 'test_name')
                    .__buildSelectQuery();

                const expectedResult = "SELECT test_id, test_name FROM test_models";

                assert.equal(result, expectedResult);
            });

            test("Empty select query string", () => {
                const result = new QueryBuilder()
                    .from('test_models')
                    .__buildSelectQuery();


                const expectedResult = "SELECT * FROM test_models";

                assert.equal(result, expectedResult);
            });
        });

        describe('Order by', () => {
            test("Order by query string", () => {
                const result = new QueryBuilder()
                    .orderBy('test_id')
                    .orderBy('test_name', 'ASC')
                    .__buildOrderByQuery();


                const expectedResult = "ORDER BY test_id DESC, test_name ASC";

                assert.equal(result, expectedResult);
            });

            test("Empty order by query string", () => {
                const result = new QueryBuilder()
                    .__buildOrderByQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Group by', () => {
            test("Group by query string", () => {
                const result = new QueryBuilder()
                    .groupBy('test_id', 'test_name')
                    .__buildGroupByQuery();

                const expectedResult = "GROUP BY test_id, test_name";

                assert.equal(result, expectedResult);
            });

            test("Empty group by query string", () => {
                const result = new QueryBuilder()
                    .__buildGroupByQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Having', () => {
            test("Having query string", () => {
                const result = new QueryBuilder()
                    .having('test_id', '=', 5)
                    .having('test_name', '=', 'test')
                    .__buildHavingQuery();

                const expectedResult = "HAVING test_id = 5 AND test_name = 'test'";

                assert.equal(result, expectedResult);
            });

            test("Empty having query string", () => {
                const result = new QueryBuilder()
                    .__buildHavingQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

        describe('Limit', () => {
            test("Limit query string", () => {
                const result = new QueryBuilder()
                    .limit(1)
                    .__buildLimitQuery();

                const expectedResult = "LIMIT 1";

                assert.equal(result, expectedResult);
            });

            test("Empty limit query string", () => {
                const result = new QueryBuilder()
                    .__buildLimitQuery();

                const expectedResult = "";

                assert.equal(result, expectedResult);
            });
        });

    });

});