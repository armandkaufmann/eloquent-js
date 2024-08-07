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

test("Can build where query string", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .where('test_id', '=', 5)
        .where('test_name', '=', 'John')
        .__buildWhereQuery();


    const expectedResult = "WHERE test_id = 5 AND test_name = 'John'";

    assert.equal(result, expectedResult);
});

test("Build empty where query string when no where specified", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .__buildWhereQuery();


    const expectedResult = "";

    assert.equal(result, expectedResult);
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

test("Can build select query string", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .select('test_id', 'test_name')
        .__buildSelectQuery();


    const expectedResult = "SELECT test_id, test_name FROM test_models";

    assert.equal(result, expectedResult);
});

test("Can build select query string with select all if no select specified", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .__buildSelectQuery();


    const expectedResult = "SELECT * FROM test_models";

    assert.equal(result, expectedResult);
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

test("Can build order by query string", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .orderBy('test_id')
        .orderBy('test_name', 'ASC')
        .__buildOrderByQuery();


    const expectedResult = "ORDER BY test_id DESC, test_name ASC";

    assert.equal(result, expectedResult);
});

test("Build empty order by query string when no order by specified", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .__buildOrderByQuery();

    const expectedResult = "";

    assert.equal(result, expectedResult);
});

test("Can properly store group by query strings", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .groupBy('test_id', 'test_name')
        .__queryGroupBy;

    const expectedResult = [ 'test_id', 'test_name' ];

    assert.deepEqual(result, expectedResult);
});

test("Can build group by query string", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .groupBy('test_id', 'test_name')
        .__buildGroupByQuery();

    const expectedResult = "GROUP BY test_id, test_name";

    assert.equal(result, expectedResult);
});

test("Can build empty group by query string when no group by provided", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .__buildGroupByQuery();

    const expectedResult = "";

    assert.equal(result, expectedResult);
});

test("Can properly store having query strings", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .having('test_id', '=', 5)
        .having('test_name', '=', 'test')
        .__queryHaving;

    const expectedResult = [ 'test_id = 5', "test_name = 'test'" ];

    assert.deepEqual(result, expectedResult);
});

test("Can build having query string", () => {
    class TestModel extends Model {
        constructor() {
            super();
        }
    }

    const result = new TestModel()
        .having('test_id', '=', 5)
        .having('test_name', '=', 'test')
        .__buildHavingQuery();

    const expectedResult = "HAVING test_id = 5 AND test_name = 'test'";

    assert.equal(result, expectedResult);
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