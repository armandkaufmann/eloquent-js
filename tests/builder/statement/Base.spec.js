import {describe, expect, beforeEach, test} from 'vitest';
import Base from "../../../src/builder/statement/Base.js";

describe("Statement: Base Test", () => {
    describe("ToString", () => {
        test("It builds string from query and bindings", () => {
           const query =  "WHERE name = ? and age > ?";
           const bindings = ['John', 20];
           const expectedString = "WHERE name = 'John' and age > 20";

           const result = new Base(bindings, query).toString()

            expect(result).toEqual(expectedString);
        });
    });

    describe("Serialize", () => {
        test("It returns an object to serialze the state", () => {
            const query =  "WHERE name = ? and age > ?";
            const bindings = ['John', 20];
            const expectedObject = {
                query, bindings, condition: 'AND'
            };

            const result = new Base(bindings, query).serialize()

            expect(result).toEqual(expectedObject);
        });
    });

});