import {describe, expect, test} from 'vitest';
import Group from "../../../src/builder/statement/Group.js";
import WhereCallback from "../../../src/builder/callback/WhereCallback.js";
import {Query} from "../../../src/builder/Query.js";

describe("Builder: WhereCallback Test", () => {
    test("toString: It modifies state of group statement", () => {
        const group = new Group();
        const callback = new WhereCallback(group);

        const expectedResult = "(`name` = 'John' AND price > IF(state = 'TX', 200, 100) OR `name` = 'Kyle' OR role LIKE Human%)"

        callback
            .where('name', 'John')
            .whereRaw("price > IF(state = 'TX', ?, 100)", [200])
            .orWhere('name', 'Kyle')
            .orWhereRaw("role LIKE Human%");

        const result = group.toString();

        expect(result).toEqual(expectedResult);
    });

    test("prepare: It modifies state of group statement", () => {
        const group = new Group();
        const callback = new WhereCallback(group);

        const expectedQuery = "(`name` = ? AND price > IF(state = 'TX', ?, 100) OR `name` = ? OR role LIKE Human%)";
        const expectedBindings = ['John', 200, 'Kyle'];

        callback
            .where('name', 'John')
            .whereRaw("price > IF(state = 'TX', ?, 100)", [200])
            .orWhere('name', 'Kyle')
            .orWhereRaw("role LIKE Human%");

        const result = group.prepare();

        expect(result.query).toEqual(expectedQuery);
        expect(result.bindings).toEqual(expectedBindings);
    });

    describe("Raw", () => {
        test("Inserts raw statement: Where", () => {
            const group = new Group();
            const callback = new WhereCallback(group);

            const expectedResult = "(`name` = 'John' AND role LIKE Human%)"

            callback
                .where('name', 'John')
                .where(Query.raw("role LIKE Human%"));

            const result = group.toString();

            expect(result).toEqual(expectedResult);
        });
    });
});