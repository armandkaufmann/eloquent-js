import {describe, expect, test} from 'vitest';
import Group from "../../../src/builder/statement/Group.js";
import WhereCallback from "../../../src/builder/callback/WhereCallback.js";

describe("Builder: Callback", () => {
    test("It modifies state of group statement", () => {
        const group = new Group();
        const callback = new WhereCallback(group);

        const expectedResult = "(name = 'John' OR name = 'Kyle')"

        callback
            .where('name', 'John')
            .orWhere('name', 'Kyle');

        const result = group.toString();

        expect(result).toEqual(expectedResult);
    });
});