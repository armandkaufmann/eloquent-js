import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export class DBConn {
    /** @type Database */
    #db = null;

    /**
     * @async
     * @returns void
     */
    async connect() {
        this.#db = await open({
            filename: '/tmp/database.db',
            driver: sqlite3.Database
        });
    }

    /**
     * @async
     * @param {string} query
     * @param {Object} bindings
     * @returns {Promise<void>|void}
     */
    async execute(query, bindings) {
        if (!this.#db) {
            return Promise.resolve(null);
        }

        const statement = await this.#db.prepare(query);
        return await statement.all(bindings);
    }
}
