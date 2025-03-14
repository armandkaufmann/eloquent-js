import {describe, expect, test} from 'vitest';
import {Base, STATEMENTS} from "../../../src/builder/statement/Base.js";

describe("Statement: Base Test", () => {
    describe("ToString", () => {
        test("It builds string from query and bindings", () => {
           const query =  "WHERE name = ? AND age > ?";
           const bindings = ['John', 20];
           const expectedString = "WHERE name = 'John' AND age > 20";

           const result = new Base(bindings, query, STATEMENTS.where, 'AND').toString()

            expect(result).toEqual(expectedString);
        });

        test("It builds string with condition", () => {
            const query =  "WHERE name = ? AND age > ?";
            const bindings = ['John', 20];
            const expectedString = "AND WHERE name = 'John' AND age > 20";

            const result = new Base(bindings, query, STATEMENTS.where, 'AND').toString(true)

            expect(result).toEqual(expectedString);
        });
    });

    describe("Serialize", () => {
        test("It returns an object to serialze the state", () => {
            const query =  "WHERE name = ? AND age > ?";
            const bindings = ['John', 20];
            const expectedObject = {
                query, bindings
            };

            const result = new Base(bindings, query, STATEMENTS.where, 'AND').prepare()

            expect(result).toEqual(expectedObject);
        });

        test("It returns an object with condition in query", () => {
            const query =  "WHERE name = ? AND age > ?";
            const bindings = ['John', 20];
            const expectedObject = {
                query: "AND " + query, bindings
            };

            const result = new Base(bindings, query, STATEMENTS.where, 'AND').prepare(true)

            expect(result).toEqual(expectedObject);
        });
    });

});