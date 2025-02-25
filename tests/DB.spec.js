import {describe, afterEach, expect, test, vi} from 'vitest';
import {DB, TEMP_DB} from "../src/DB.js";
import {open, dbMock} from 'sqlite';
import sqlite3 from "sqlite3";

vi.mock('sqlite', () => {
    const sqliteMock = {
        prepare: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({'name': 'test'}),
        all: vi.fn().mockResolvedValue([{'name': 'test'}]),
        run: vi.fn().mockResolvedValue({'name': 'test'}),
        close: vi.fn().mockResolvedValue(),
    }

    const open = vi.fn().mockResolvedValue(sqliteMock);

    return {open, dbMock: sqliteMock}
});

describe('DB Test', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    //don't need this test
    describe('connect', () => {
        test.skip('it opens a connection to the database', async () => {
            const db = new DB();

            expect(open).toHaveBeenCalledWith({
                filename: TEMP_DB,
                driver: sqlite3.Database
            });
        });
    });

    describe("All", () => {
        test("it connects and disconnects when running a query", async () => {
            const db = new DB();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            await db.all(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: TEMP_DB,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const db = new DB();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            const result = await db.all(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledOnce();
            expect(dbMock.prepare).toHaveBeenCalledWith(query);
            expect(dbMock.all).toHaveBeenCalledOnce();
            expect(dbMock.all).toHaveBeenCalledWith(bindings);

            expect(result).toEqual([{'name': 'test'}]);
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async() => null);

            const db = new DB();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : "John"};

            const result = await db.all(query, bindings);

            expect(dbMock.prepare).not.toHaveBeenCalled();
            expect(dbMock.all).not.toHaveBeenCalled();

            expect(result).toEqual(null);
        });
    });

    describe("Get", () => {
        test("Gets a single row", async () => {
            const db = await DB.connect();
            const query = 'SELECT * FROM users WHERE name=?';
            const bindings = ["John"];

            const result = await db.get(query, bindings);

            expect(result).toEqual({});

            expect(dbMock.get).toHaveBeenCalledWith(query, bindings);
        })
    });

    describe("Insert", () => {
       test('It inserts a new record into a table', async () => {
           const db = await DB.connect();
           const query = "INSERT INTO users (name) VALUES (?)";
           const bindings = ["John"];

           const result = await db.insert(query, bindings);

           expect(result).toEqual({});

           expect(dbMock.run).toHaveBeenCalledWith(query, bindings);
       });

        test('It returns null when inserting with no active connection database', async () => {
            const db = new DB();
            const query = "INSERT INTO users (name) VALUES (?)";
            const bindings = ["John"];

            const result = await db.insert(query, bindings);

            expect(result).toEqual(null);

            expect(dbMock.run).not.toHaveBeenCalled();
        });
    });
})