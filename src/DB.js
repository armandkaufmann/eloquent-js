import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export const TEMP_DB = '/tmp/database.sqlite';

export class DB {
    /** @type {?Database} */
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
     * @returns DB
     */
    static async connect(options = {}){
        const filename = options.filename || TEMP_DB;
        const db = await open({
            filename,
            driver: sqlite3.Database
        });

        return new DB(db);
    }

    /**
     * @async
     * @param {Object} [options={}]
     * @returns DB
     */
    async connect(options = {}){
        if (this.db) {
            return this;
        }

        const filename = options.filename || '/tmp/database.sqlite';
        this.db = await open({
            filename,
            driver: sqlite3.Database
        });

        return this;
    }

    /**
     * @returns void
     */
    async disconnect() {
        await this.db.close();
        this.db = null;
    }

    /**
     * @async
     * @param {string} query
     * @param {Record<string, any>} bindings
     * @returns {Promise<null|Object[]>}
     */
    async all(query, bindings) {
        if (!this.db) {
            return Promise.resolve(null);
        }

        const statement = await this.db.prepare(query);
        return await statement.all(bindings);
    }

    /**
     * @async
     * @param {string} query
     * @param {string[]} bindings
     * @returns {Promise<null|Object>}
     */
    async get(query, bindings){
        return this.db.get(query, bindings);
    }

}
