import {test, describe} from "node:test";
import assert from "node:assert/strict";
import {Model} from "../../src/model/Model.js";

describe('ModelTest', () => {

    describe('initialization', () => {
        test("can retrieve model name from object", () => {
            class TestModel extends Model {
                constructor() {
                    super();
                }
            }

            const result = new TestModel();
            assert.equal(result._getModelName(), 'TestModel')
        });

        test("Base class constructs proper table name", () => {
            class TestModel extends Model {
                constructor() {
                    super();
                }
            }

            const result = new TestModel();
            assert.equal(result.table, 'test_models')
        });

        test("Base class doesn't construct table name if already exists on model", () => {
            class TestModel extends Model {
                table = 'my_table';

                constructor() {
                    super();
                }
            }

            const result = new TestModel();
            assert.equal(result.table, 'my_table')
        });
    });

    describe('Create', () => {
        test("Can create a model using table attribute name", () => {
            class TestModel extends Model {
                table = 'my_table';
                constructor() {
                    super();
                }
            }

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            const result = new TestModel().create(fields);
            const expectedResult = "INSERT INTO my_table (test_id, test_name) VALUES (5, 'John')";

            assert.equal(result, expectedResult);
        });

        test("Can create a model using object", () => {
            class TestModel extends Model {
                constructor() {
                    super();
                }
            }

            let fields = {
                test_id: 5,
                test_name: 'John',
            };

            const result = new TestModel().create(fields);
            const expectedResult = "INSERT INTO test_models (test_id, test_name) VALUES (5, 'John')";

            assert.equal(result, expectedResult);
        });
    });

});


// test("Can build complete query string", () => {
//     class TestModel extends Model {
//         constructor() {
//             super();
//         }
//     }
//
//     const result = new TestModel()
//         .select('test_id', 'test_name')
//         .where('test_id', '>=', 5)
//         .where('test_name', 'LIKE', "%test%")
//         .toSql();
//
//     const expectedResult = "SELECT test_id, test_name FROM test_model WHERE test_id >= 5 AND test_name LIKE '%test%'";
//
//     assert.equal(result, expectedResult);
// });