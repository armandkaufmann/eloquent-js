import {describe, beforeEach, afterEach, expect, test, vi} from 'vitest';
import {DBConn} from "../src/DBConn.js";
import {open, dbSpy} from 'sqlite';
import sqlite3 from "sqlite3";


describe('DBConn Test', () => {
    beforeEach(() => {
        vi.mock('sqlite', () => {
            const dbSpy = {
                prepare: vi.fn().mockReturnThis(),
                all: vi.fn(),
            }

            const open = vi.fn().mockResolvedValue(dbSpy);

            return {open, dbSpy}
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

    describe('connect', () => {
        test('it opens a connection to the database', async () => {
            const db = new DBConn();
            await db.connect();

            expect(open).toHaveBeenCalledWith({
                filename: '/tmp/database.db',
                driver: sqlite3.Database
            });
        });
    });

    describe('execute', () => {
        test('it prepares and binds statements', async () => {
            const db = new DBConn();
            const query = 'SELECT * FROM users WHERE name=1';
            const bindings = {1 : 'John'};

            await db.connect();
            await db.execute(query, bindings);

            expect(dbSpy.prepare).toHaveBeenCalledOnce();
            expect(dbSpy.prepare).toHaveBeenCalledWith(query);

            expect(dbSpy.all).toHaveBeenCalledOnce();
            expect(dbSpy.all).toHaveBeenCalledWith(bindings);
        });
    });
})