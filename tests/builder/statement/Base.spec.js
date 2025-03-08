import {describe, expect, test} from 'vitest';
import {Base, STATEMENTS} from "../../../src/builder/statement/Base.js";

describe("Statement: Base Test", () => {
    describe("ToString", () => {
        test("It builds string from query and bindings", () => {
           const query =  "WHERE name = ? and age > ?";
           const bindings = ['John', 20];
           const expectedString = "WHERE name = 'John' and age > 20";

           const result = new Base(bindings, query, STATEMENTS.where).toString()

            expect(result).toEqual(expectedString);
        });

        test("It builds string with condition", () => {
            const query =  "WHERE name = ? and age > ?";
            const bindings = ['John', 20];
            const expectedString = "AND WHERE name = 'John' and age > 20";

            const result = new Base(bindings, query, STATEMENTS.where).toString(true)

            expect(result).toEqual(expectedString);
        });
    });

    describe("Serialize", () => {
        test("It returns an object to serialze the state", () => {
            const query =  "WHERE name = ? and age > ?";
            const bindings = ['John', 20];
            const expectedObject = {
                query, bindings
            };

            const result = new Base(bindings, query, STATEMENTS.where).serialize()

            expect(result).toEqual(expectedObject);
        });

        test("It returns an object with condition in query", () => {
            const query =  "WHERE name = ? and age > ?";
            const bindings = ['John', 20];
            const expectedObject = {
                query: "AND " + query, bindings
            };

            const result = new Base(bindings, query, STATEMENTS.where).serialize(true)

            expect(result).toEqual(expectedObject);
        });
    });

});