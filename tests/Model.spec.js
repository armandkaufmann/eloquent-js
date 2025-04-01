import {afterEach, describe, expect, test, vi} from 'vitest';
import {Model} from "../src/Model.js";
import {Query} from "../src/builder/Query.js";

vi.mock("../src/builder/Query.js", () => {
    const Query = vi.fn();
    Query.prototype.from = vi.fn().mockReturnThis();
    Query.prototype.insert = vi.fn().mockReturnThis();
    Query.prototype.orderBy = vi.fn().mockReturnThis();
    Query.prototype.limit = vi.fn().mockReturnThis();
    Query.prototype.toSql = vi.fn().mockReturnThis();
    Query.prototype.select = vi.fn().mockReturnThis();
    Query.prototype.where = vi.fn().mockReturnThis();
    Query.prototype.groupBy = vi.fn().mockReturnThis();
    Query.prototype.having = vi.fn().mockReturnThis();
    Query.from = vi.fn().mockImplementation((table) => new Query().from(table));

    return {Query}
})

describe("ModelTest", () => {
    class TestModel extends Model {
    }

    const testModelPluralizedName = 'test_models';
    const testModelBaseName = 'TestModel';

    afterEach(() => {
        vi.clearAllMocks();
    })

    describe("Initialization", () => {
        test("Can retrieve model name table object", () => {
            const result = new TestModel();
            expect(result._getModelName()).toBe(testModelBaseName);
        });

        test("Base class constructs proper table name", () => {
            const result = new TestModel();
            expect(result.table).toBe(testModelPluralizedName);
        });

        test("Base class doesn't construct table name if already exists on model", () => {

            const table = 'my_table'

            class TestModel extends Model {
                constructor() {
                    super({table});
                }
            }

            const result = new TestModel();
            expect(result.table).toBe(table)
        });
    });

    describe("Model methods", () => {
        describe("Create", () => {
            test("Can create a model using table attribute name", () => {
                const table = 'my_table';

                class TestModel extends Model {
                    constructor() {
                        super({table});
                    }
                }

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                new TestModel().create(fields);

                expect(Query.prototype.from).toHaveBeenCalledWith(table);
                expect(Query.prototype.insert).toHaveBeenCalledWith(fields);
            });

            test("Can create a model using object", () => {

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                new TestModel().create(fields);

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.insert).toHaveBeenCalledWith(fields);
            });
        });

        describe("Select", () => {
            test("Select: single column", () => {
                new TestModel().select('name');

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.select).toHaveBeenCalledWith('name');
            });

            test("Select: multi column", () => {
                new TestModel().select('id', 'name', 'email');

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.select).toHaveBeenCalledWith('id', 'name', 'email');
            });
        });

        test("Where", () => {
            new TestModel().where('id', '=', 5);

            expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(Query.prototype.where).toHaveBeenCalledWith('id', '=', 5);
        });

        describe('When', () => {
            test('It executes callback when conditional is true', () => {
                const callbackSpy = vi.fn();

                let model = new TestModel();

                model.when(true, callbackSpy);

                expect(callbackSpy).toHaveBeenCalledWith(model);
            });

            test('It does not execute call back when conditional is false', () => {
                const callbackSpy = vi.fn();

                let model = new TestModel();

                model.when(false, callbackSpy);

                expect(callbackSpy).not.toHaveBeenCalled();
            });
        });

        describe("Group By", () => {
            test("Group By: single column", () => {
                const column = 'name';
                new TestModel().groupBy(column);

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.groupBy).toHaveBeenCalledWith(column);
            });

            test("Group By: multi column", () => {
                new TestModel().groupBy('id', 'name', 'email');

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.groupBy).toHaveBeenCalledWith('id', 'name', 'email');
            });
        });

        test("Having", () => {
            new TestModel().having('id', '=', 5);

            expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(Query.prototype.having).toHaveBeenCalledWith('id', '=', 5);
        });
    });

    describe("Convenience methods", () => {
        test("All static", () => {

            TestModel.all();

            expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
            expect(Query.prototype.toSql).toHaveBeenCalled();
        });

        describe('Create', () => {
            test("Create static", () => {

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                TestModel.create(fields);

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.insert).toHaveBeenCalledWith(fields);
            });

            test("Create static with table override", () => {
                const table = 'users';

                class TableOverrideClass extends Model {
                    constructor() {
                        super({table});
                    }
                }

                let fields = {
                    test_id: 5,
                    test_name: 'John',
                };

                TableOverrideClass.create(fields);

                expect(Query.prototype.from).toHaveBeenCalledWith(table);
                expect(Query.prototype.insert).toHaveBeenCalledWith(fields);
            });
        })


        describe("First", () => {
            test("First static", () => {

                TestModel.first();

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.limit).toHaveBeenCalledWith(1);
                expect(Query.prototype.toSql).toHaveBeenCalled();
            });

            test("First model method", () => {

                new TestModel().orderBy('id').first();

                expect(Query.prototype.from).toHaveBeenCalledWith(testModelPluralizedName);
                expect(Query.prototype.limit).toHaveBeenCalledWith(1);
                expect(Query.prototype.toSql).toHaveBeenCalled();
            });
        });
    });
});