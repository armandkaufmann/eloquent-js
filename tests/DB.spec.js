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
        run: vi.fn().mockResolvedValue({
            stmt: {},
            lastID: 1,
            changes: 2
        }),
        all: vi.fn().mockResolvedValue([{}]),
        get: vi.fn().mockResolvedValue({}),
        close: vi.fn().mockResolvedValue(),
    }

    const open = vi.fn().mockResolvedValue(sqliteMock);

    return {open, dbMock: sqliteMock, statementMock}
});

describe('DB Test', () => {
    let db = null;
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    beforeEach(() => {
        db = new DB();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("All", () => {
        const query = 'SELECT * FROM users WHERE name=?';
        const bindings = ['John'];

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

            expect(dbMock.all).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual([{}]);
        });

        test("It does not run if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.all()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.all).not.toHaveBeenCalled();
        });

        test("It can gracefully recover after an error", async () => {
            dbMock.all.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = await db.all(query, bindings);

            expect(result).toEqual([]);
            expect(consoleMock).toHaveBeenCalledOnce();
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

            expect(dbMock.get).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual({});
        });

        test("it does not run if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.get()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.get).not.toHaveBeenCalled();
        });

        test("It casts undefined to null", async () => {
            dbMock.get.mockResolvedValueOnce(undefined);

            const result = await db.get(query, bindings);

            expect(dbMock.get).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual(null);
        });

        test("It can gracefully recover after an error", async () => {
            dbMock.get.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = await db.get(query, bindings);

            expect(result).toEqual(null);
            expect(consoleMock).toHaveBeenCalledOnce();
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

            expect(result).toEqual(true);
        });

        test("It does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.insert()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.run).not.toHaveBeenCalled();
        });

        test("It can gracefully recover after an error", async () => {
            dbMock.run.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = await db.insert(query, bindings);

            expect(result).toEqual(false);
            expect(consoleMock).toHaveBeenCalledOnce();
        });

        test("Insert (withID = true): It can gracefully recover after an error", async () => {
            dbMock.run.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = await db.insert(query, bindings, true);

            expect(result).toEqual(null);
            expect(consoleMock).toHaveBeenCalledOnce();
        });

        test("Insert (withID = true): It can return the last ID of the recently inserted record",  async () => {
            const result = await db.insert(query, bindings, true);

            expect(dbMock.run).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual(1);
        });
    });

    describe("Update or Delete", () => {
        const query ="UPDATE `users` SET name = ?, address = ? WHERE `id` = ? ORDER BY `name` ASC LIMIT ?";
        const bindings = ['john', '123 Taco Lane Ave St', 5, 5]

        test("it connects and disconnects when running the query", async () => {
            await db.updateOrDelete(query, bindings);

            expect(open).toHaveBeenCalledWith({
                filename: defaultConfig.database.file,
                driver: sqlite3.Database
            });

            expect(dbMock.close).toHaveBeenCalledOnce();
        });

        test("It prepares and runs the query", async () => {
            const result = await db.updateOrDelete(query, bindings);

            expect(dbMock.run).toHaveBeenCalledWith(query, bindings);

            expect(result).toEqual(2);
        });

        test("It does not prepare and bind if there is no db", async () => {
            open.mockImplementationOnce(async () => null);

            await expect(async () => await db.updateOrDelete()).rejects.toThrowError(DatabaseNotFoundError);

            expect(dbMock.run).not.toHaveBeenCalled();
        });

        test("It can gracefully recover after an error", async () => {
            dbMock.run.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = await db.updateOrDelete(query, bindings);

            expect(result).toEqual(null);
            expect(consoleMock).toHaveBeenCalledOnce();
        });
    });
})