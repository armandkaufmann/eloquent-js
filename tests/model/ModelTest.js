import test from "node:test";
import assert from "node:assert/strict";
import {Model} from "../../src/model/Model.js";

test("can retrieve model name from object", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel();
    assert.equal(result.__getModelName(), 'TestModel')
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

    const result = new TestModel().__insert(fields);
    const expectedResult = "INSERT INTO test_models (test_id, test_name) VALUES (5, 'John')";

    assert.equal(result, expectedResult);
});

test("Can properly store where query strings", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .where('test_id', '=', 5)
        .where('test_name', '=', 'John')
        .__queryWhere;


    const expectedResult = [ 'test_id = 5', "test_name = 'John'" ];

    assert.deepEqual(result, expectedResult);
});

test("Can properly store select query strings", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .select('test_id', 'test_name')
        .__querySelect;


    const expectedResult = [ 'test_id', 'test_name' ];

    assert.deepEqual(result, expectedResult);
});

test("Can properly store order by query strings", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .orderBy('test_id')
        .orderBy('test_name', 'ASC')
        .__queryOrderBy;


    const expectedResult = [ 'test_id DESC', 'test_name ASC' ];

    assert.deepEqual(result, expectedResult);
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