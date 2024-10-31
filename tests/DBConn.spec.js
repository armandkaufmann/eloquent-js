import {describe, beforeEach, afterEach, expect, test, vi} from 'vitest';
import {DBConn} from "../src/DBConn.js";
import {open, dbMock} from 'sqlite';
import sqlite3 from "sqlite3";


describe('DBConn Test', () => {
    describe('connect', () => {
        beforeEach(() => {
            vi.mock('sqlite', () => {
                const open = vi.fn();

                return {open}
            });
        });

        afterEach(() => {
            vi.clearAllMocks();
        });

        test.skip('it opens a connection to the database', async () => {
            const db = await DBConn.connect();

            expect(open).toHaveBeenCalledWith({
                filename: '/tmp/database.db',
                driver: sqlite3.Database
            });
        });
    });

    describe('execute', () => {
        beforeEach(() => {
            vi.mock('sqlite', () => {
                const sqliteMock = {
                    prepare: vi.fn().mockReturnThis(),
                    all: vi.fn(),
                }

                const open = vi.fn().mockResolvedValue(sqliteMock);

                return {open, dbMock: sqliteMock}
            });
        });

        afterEach(() => {
            vi.clearAllMocks();
        })

        test('it prepares and binds statements', async () => {
            const db = await DBConn.connect();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            await db.execute(query, bindings);

            expect(dbMock.prepare).toHaveBeenCalledOnce();
            expect(dbMock.prepare).toHaveBeenCalledWith(query);

            expect(dbMock.all).toHaveBeenCalledOnce();
            expect(dbMock.all).toHaveBeenCalledWith(bindings);
        });

        test('it does not prepare and bind if there is no db', async () => {
            open = vi.fn().mockResolvedValue(null)

            const db = await DBConn.connect();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            await db.execute(query, bindings);

            expect(dbMock.prepare).not.toHaveBeenCalled();

            expect(dbMock.all).not.toHaveBeenCalled();
        });

    });
})