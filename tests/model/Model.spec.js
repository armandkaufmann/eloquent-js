import {afterEach, describe, expect, test, vi} from 'vitest';
import {Model} from "../../src/model/Model.js";
import {QueryBuilder} from "../../src/model/QueryBuilder.js";

vi.mock("../../src/model/QueryBuilder.js", () => {
    const QueryBuilder = vi.fn();
    QueryBuilder.prototype.from = vi.fn().mockReturnThis();
    QueryBuilder.prototype.insert = vi.fn().mockReturnThis();
    QueryBuilder.prototype.orderBy = vi.fn().mockReturnThis();
    QueryBuilder.prototype.limit = vi.fn().mockReturnThis();
    QueryBuilder.prototype.toSql = vi.fn().mockReturnThis();
    QueryBuilder.prototype.select = vi.fn().mockReturnThis();
    QueryBuilder.prototype.where = vi.fn().mockReturnThis();
    QueryBuilder.prototype.groupBy = vi.fn().mockReturnThis();
    QueryBuilder.prototype.having = vi.fn().mockReturnThis();

    return { QueryBuilder }
})


describe("ModelTest", () => {
    class TestModel extends Model {}
    const testModelPluralizedName = 'test_models';
    const testModelBaseName = 'TestModel';

    afterEach(() => {
        vi.clearAllMocks();
    })

    describe("Initialization", () => {
        test("Can retrieve model name from object", () => {
            const result = new TestModel();
            expect(result._getModelName()).toBe(testModelBaseName);
        });

        test("Base class constructs proper table name", () => {
            const result = new TestModel();
            expect(result.table).toBe(testModelPluralizedName);
        });

        test("Base class doesn't construct table name if already exists on model", () => {
            class TestModel extends Model {
                table = 'my_table';
            }

            const result = new TestModel();
            expect(result.table).toBe('my_table')
        });
    });

    describe("Model methods", () => {
        describe("Create", () => {
            test("Can create a model using table attribute name", () => {
                class TestModel extends Model {
                    table = 'my_table';
                }

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                new TestModel().create(fields);

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith('my_table');
                expect(QueryBuilder.prototype.insert).toHaveBeenCalledWith(fields);
            });

            test("Can create a model using object", () => {

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                new TestModel().create(fields);

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.insert).toHaveBeenCalledWith(fields);
            });
        });

        describe("Select", () => {
            test("Select: single column", () => {
                new TestModel().select('name');

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.select).toHaveBeenCalledWith('name');
            });

            test("Select: multi column", () => {
                new TestModel().select('id', 'name', 'email');

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.select).toHaveBeenCalledWith('id', 'name', 'email');
            });
        });

        test("Where", () => {
            new TestModel().where('id', '=', 5);

            expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(QueryBuilder.prototype.where).toHaveBeenCalledWith('id', '=', 5);
        });

        describe("Group By", () => {
            test("Group By: single column", () => {
                const column = 'name';
                new TestModel().groupBy(column);

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.groupBy).toHaveBeenCalledWith(column);
            });

            test("Group By: multi column", () => {
                new TestModel().groupBy('id', 'name', 'email');

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.groupBy).toHaveBeenCalledWith('id', 'name', 'email');
            });
        });

        test("Having", () => {
            new TestModel().having('id', '=', 5);

            expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(QueryBuilder.prototype.having).toHaveBeenCalledWith('id', '=', 5);
        });
    });


    describe("Convenience methods", () => {
        test("All static", () => {

            TestModel.all();

            expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(QueryBuilder.prototype.toSql).toHaveBeenCalled();
        });

        test("Create static", () => {

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            TestModel.create(fields);

            expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(QueryBuilder.prototype.insert).toHaveBeenCalledWith(fields);
        });

        describe("First", () => {
            test("First static", () => {

                TestModel.first();

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.limit).toHaveBeenCalledWith(1);
                expect(QueryBuilder.prototype.toSql).toHaveBeenCalled();
            });

            test("First model method", () => {

                new TestModel().orderBy('id').first();

                expect(QueryBuilder.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(QueryBuilder.prototype.limit).toHaveBeenCalledWith(1);
                expect(QueryBuilder.prototype.toSql).toHaveBeenCalled();
            });
        });
    });
});