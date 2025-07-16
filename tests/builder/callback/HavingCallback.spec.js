import {describe, expect, test} from 'vitest';
import Group from "../../../src/builder/statement/Group.js";
import HavingCallback from "../../../src/builder/callback/HavingCallback.js";
import WhereCallback from "../../../src/builder/callback/WhereCallback.js";
import {Query} from "../../../src/builder/Query.js";

describe("Builder: HavingCallback Test", () => {
    test("toString: It modifies state of group statement", () => {
        const group = new Group();
        const callback = new HavingCallback(group);

        const expectedResult = "(`account_id` > 100 AND `order_count` BETWEEN 5 AND 15 OR `purchase_count` = 5 AND SUM(price) > 2500)"

        callback
            .having("account_id", '>', 100)
            .havingBetween("order_count", [5, 15])
            .orHaving("purchase_count", 5)
            .havingRaw('SUM(price) > ?', [2500])

        const result = group.toString();

        expect(result).toEqual(expectedResult);
    });

    test("prepare: It modifies state of group statement", () => {
        const group = new Group();
        const callback = new HavingCallback(group);

        const expectedQuery = "(`account_id` > ? AND `order_count` BETWEEN ? AND ? OR `purchase_count` = ? AND SUM(price) > ?)"
        const expectedBindings = [100, 5, 15, 5, 2500];

        callback
            .having("account_id", '>', 100)
            .havingBetween("order_count", [5, 15])
            .orHaving("purchase_count", 5)
            .havingRaw('SUM(price) > ?', [2500])

        const result = group.prepare();

        expect(result.query).toEqual(expectedQuery);
        expect(result.bindings).toEqual(expectedBindings);
    });

    describe("Raw", () => {
        test("Inserts raw statement: Having", () => {
            const group = new Group();
            const callback = new HavingCallback(group);

            const expectedResult = "(`name` = 'John' AND role LIKE Human%)"

            callback
                .having('name', 'John')
                .having(Query.raw("role LIKE Human%"));

            const result = group.toString();

            expect(result).toEqual(expectedResult);
        });

        test("Inserts raw statement: orHaving", () => {
            const group = new Group();
            const callback = new HavingCallback(group);

            const expectedResult = "(`name` = 'John' OR role LIKE Human%)"

            callback
                .having('name', 'John')
                .orHaving(Query.raw("role LIKE Human%"));

            const result = group.toString();

            expect(result).toEqual(expectedResult);
        });
    });
});