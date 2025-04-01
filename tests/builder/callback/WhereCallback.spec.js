import {describe, expect, test} from 'vitest';
import Group from "../../../src/builder/statement/Group.js";
import WhereCallback from "../../../src/builder/callback/WhereCallback.js";

describe("Builder: Callback", () => {
    test("It modifies state of group statement", () => {
        const group = new Group();
        const callback = new WhereCallback(group);

        const expectedResult = "(name = 'John' AND price > IF(state = 'TX', 200, 100) OR name = 'Kyle' OR role LIKE Human%)"

        callback
            .where('name', 'John')
            .whereRaw("price > IF(state = 'TX', ?, 100)", [200])
            .orWhere('name', 'Kyle')
            .orWhereRaw("role LIKE Human%");

        const result = group.toString();

        expect(result).toEqual(expectedResult);
    });
});