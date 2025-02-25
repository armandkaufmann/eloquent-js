import {describe, afterEach, beforeEach, expect, test, vi} from 'vitest';
import {DB, TEMP_DB} from "../src/DB.js";
import {open, dbMock} from 'sqlite';
import sqlite3 from "sqlite3";
import {QueryBuilder} from "../src/QueryBuilder.js";
import {TableNotSetError} from "../src/errors/QueryBuilder/Errors.js";
import {DatabaseNotFoundError} from "../src/errors/DB/Errors.js";

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
    let db = null;

    beforeEach(() => {
        db = new DB();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("All", () => {
        const query = 'SELECT * FROM users WHERE name=1';
        const bindings = {1: 'John'};

        test("it connects and disconnects when running the query", async () => {
            await db.all(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: TEMP_DB,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.all(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledOnce();
            expect(dbMock.prepare).toHaveBeenCalledWith(query);
            expect(dbMock.all).toHaveBeenCalledOnce();
            expect(dbMock.all).toHaveBeenCalledWith(bindings);

            expect(result).toEqual([{'name': 'test'}]);
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.all()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.prepare).not.toHaveBeenCalled();
            expect(dbMock.all).not.toHaveBeenCalled();
        });
    });

    describe("Get", () => {
        const query = 'SELECT * FROM users WHERE name=1';
        const bindings = {1: 'John'};

        test("it connects and disconnects when running the query", async () => {
            await db.get(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: TEMP_DB,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.get(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledOnce();
            expect(dbMock.prepare).toHaveBeenCalledWith(query);
            expect(dbMock.get).toHaveBeenCalledOnce();
            expect(dbMock.get).toHaveBeenCalledWith(bindings);

            expect(result).toEqual({'name': 'test'});
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.get()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.prepare).not.toHaveBeenCalled();
            expect(dbMock.get).not.toHaveBeenCalled();
        });
    });
})