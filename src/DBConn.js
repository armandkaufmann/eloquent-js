import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export class DBConn {
    /** @type {Database|null} */
    db = null;

    /**
     * @param {Database} [db=null]
     */
    constructor(db = null) {
        this.db = db;
    }

    /**
     * @async
     * @param {Object} [options={}]
     * @returns DBConn
     */
    static async connect(options = {}){
        const filename = options.filename || '/tmp/database.sqlite';
        const db = await open({
            filename,
            driver: sqlite3.Database
        });

        return new DBConn(db);
    }

    /**
     * @returns void
     */
    close() {
        this.db.close();
        this.db = null;
    }

    /**
     * @async
     * @param {string} query
     * @param {Object} bindings
     * @returns {Promise<null|Object>}
     */
    async execute(query, bindings) {
        if (!this.db) {
            return Promise.resolve(null);
        }

        const statement = await this.db.prepare(query);
        return await statement.all(bindings);
    }
}
