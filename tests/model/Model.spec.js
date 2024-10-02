import {describe, test, expect} from 'vitest';
import {Model} from "../../src/model/Model.js";


describe("ModelTest", () => {

    describe("Initialization", () => {
        test("Can retrieve model name from object", () => {
            class TestModel extends Model {}

            const result = new TestModel();
            expect(result._getModelName()).toBe('TestModel');
        });

        test("Base class constructs proper table name", () => {
            class TestModel extends Model {}

            const result = new TestModel();
            expect(result.table).toBe('test_models');
        });

        test("Base class doesn't construct table name if already exists on model", () => {
            class TestModel extends Model {
                table = 'my_table';
            }

            const result = new TestModel();
            expect(result.table).toBe('my_table')
        });
    });

    describe("Create", () => {
        test("Can create a model using table attribute name", () => {
            class TestModel extends Model {
                table = 'my_table';
            }

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            const result = new TestModel().create(fields);
            const expectedResult = "INSERT INTO my_table (test_id, test_name) VALUES (5, 'John')";

            expect(result).toBe(expectedResult);
        });

        test("Can create a model using object", () => {
            class TestModel extends Model {}

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            const result = new TestModel().create(fields);
            const expectedResult = "INSERT INTO test_models (test_id, test_name) VALUES (5, 'John')";

            expect(result).toBe(expectedResult);
        });
    });

    describe("Convenience methods", () => {
        test("All static", () => {
            class TestModel extends Model {}

            const result = TestModel.all();
            const expectedResult = "SELECT * FROM test_models";

            expect(result).toBe(expectedResult)
        });

        test("Create static", () => {
            class TestModel extends Model {}

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            const result = TestModel.create(fields);
            const expectedResult = "INSERT INTO test_models (test_id, test_name) VALUES (5, 'John')";

            expect(result).toBe(expectedResult);
        });

        describe("First", () => {
            test("First static", () => {
                class TestModel extends Model {}

                const result = TestModel.first();
                const expectedResult = "SELECT * FROM test_models LIMIT 1";

                expect(result).toBe(expectedResult);
            });

            test("First model method", () => {
                class TestModel extends Model {}

                const result = new TestModel().orderBy('id').first();
                let expectedResult = "SELECT * FROM test_models ORDER BY id DESC LIMIT 1";

                expect(result).toBe(expectedResult);
            });
        });
    });
});