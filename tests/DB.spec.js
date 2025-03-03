import {describe, afterEach, beforeEach, expect, test, vi} from 'vitest';
import {DB} from "../src/DB.js";
import {open, dbMock, statementMock} from 'sqlite';
import sqlite3 from "sqlite3";
import {DatabaseNotFoundError} from "../src/errors/DB/Errors.js";
import {defaultConfig} from "../src/config/Default.js";

vi.mock('sqlite', () => {
    const statementMock = {
        all: vi.fn().mockResolvedValue([{'name': 'test'}]),
        finalize: vi.fn().mockResolvedValue(),
        get: vi.fn().mockResolvedValue({'name': 'test'}),
    }

    const sqliteMock = {
        prepare: vi.fn().mockResolvedValue(statementMock),
        run: vi.fn().mockResolvedValue({}),
        close: vi.fn().mockResolvedValue(),
    }

    const open = vi.fn().mockResolvedValue(sqliteMock);

    return {open, dbMock: sqliteMock, statementMock}
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
                filename: defaultConfig.database.file,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.all(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledWith(query);
            expect(statementMock.all).toHaveBeenCalledWith(bindings);
            expect(statementMock.finalize).toHaveBeenCalledOnce();

            expect(result).toEqual([{'name': 'test'}]);
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.all()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.prepare).not.toHaveBeenCalled();
            expect(statementMock.all).not.toHaveBeenCalled();
            expect(statementMock.finalize).not.toHaveBeenCalled();
        });
    });

    describe("Get", () => {
        const query = 'SELECT * FROM users WHERE name=1';
        const bindings = {1: 'John'};

        test("it connects and disconnects when running the query", async () => {
            await db.get(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: defaultConfig.database.file,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.get(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledWith(query);
            expect(statementMock.get).toHaveBeenCalledWith(bindings);
            expect(statementMock.finalize).toHaveBeenCalledOnce();

            expect(result).toEqual({'name': 'test'});
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.get()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.prepare).not.toHaveBeenCalled();
            expect(statementMock.get).not.toHaveBeenCalled();
            expect(statementMock.finalize).not.toHaveBeenCalled();
        });
    });

    describe("Insert", () => {
        const query = 'INSERT INTO users (name) VALUES (?)';
        const bindings = ['John'];

        test("it connects and disconnects when running the query", async () => {
            await db.insert(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: defaultConfig.database.file,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.insert(query, bindings);

            expect(dbMock.run).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual({});
        });

        test("it does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.insert()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.run).not.toHaveBeenCalled();
        });
    });
})