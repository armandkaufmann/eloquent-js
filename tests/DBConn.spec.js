import {describe, beforeEach, afterEach, expect, test, vi} from 'vitest';
import {DB, TEMP_DB} from "../src/DB.js";
import {open, dbMock} from 'sqlite';
import sqlite3 from "sqlite3";

vi.mock('sqlite', () => {
    const sqliteMock = {
        prepare: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({}),
        all: vi.fn().mockResolvedValue({}),
    }

    const open = vi.fn().mockResolvedValue(sqliteMock);

    return {open, dbMock: sqliteMock}
});

describe('DBConn Test', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('connect', () => {
        test('it opens a connection to the database', async () => {
            const db = await DB.connect();

            expect(open).toHaveBeenCalledWith({
                filename: TEMP_DB,
                driver: sqlite3.Database
            });
        });
    });

    describe("All", () => {
        test("it prepares and binds statements", async () => {
            const db = await DB.connect();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            await db.all(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledOnce();
            expect(dbMock.prepare).toHaveBeenCalledWith(query);

            expect(dbMock.all).toHaveBeenCalledOnce();
            expect(dbMock.all).toHaveBeenCalledWith(bindings);
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async() => null);

            const db = await DB.connect();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : "John"};

            await db.all(query, bindings);

            expect(dbMock.prepare).not.toHaveBeenCalled();

            expect(dbMock.all).not.toHaveBeenCalled();
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
})