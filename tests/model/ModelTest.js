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

test("Can build where query", () => {
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