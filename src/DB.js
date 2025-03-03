import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {DatabaseNotFoundError} from "./errors/DB/Errors.js";
import {config} from "./config/Config.js";
import {resolve} from "path";
import {MEMORY} from "./config/Default.js";

export class DB {
    /** @type {?Database} */
    #db = null;

    /**
     * @async
     * @returns void
     */
    async #connect() {
        if (this.#db) {
            return this;
        }

        this.#db = await open({
            filename: this.#getFilePath(),
            driver: sqlite3.Database
        });
    }

    /**
     * @returns string
     */
    #getFilePath() {
        const filePath = config.get('database.file');
        const isRelative = config.get('database.relative');

        if (filePath === MEMORY) {
            return filePath;
        }

        return isRelative ? resolve(process.cwd(), filePath) : resolve(filePath);
    }

    /**
     * @async
     * @returns void
     */
    async #disconnect() {
        await this.#db.close();
        this.#db = null;
    }

    /**
     * @async
     * @param {{async(): Object|Array<Object>|null}} callback
     * @returns {null|Array<Object>|Object}
     */
    async #execute(callback) {
        await this.#connect();

        if (!this.#db) {
            throw new DatabaseNotFoundError('DB', this.#getFilePath());
        }

        const result = await callback();

        await this.#disconnect();

        return result;
    }

    /**
     * @async
     * @param {string} query
     * @param {Array<String>} [bindings=[]]
     * @returns {Array<Object>|Array}
     */
    async all(query, bindings = []) {
        const callback = async () => {
            const statement = await this.#db.prepare(query);
            const result = await statement.all(bindings);

            await statement.finalize();

            return result;
        }

        return this.#execute(callback);
    }

    /**
     * @async
     * @param {string} query
     * @param {Array<String>} [bindings=[]]
     * @returns {Undefined|Object}
     */
    async get(query, bindings = []) {
        const callback = async () => {
            const statement = await this.#db.prepare(query);
            const result = statement.get(bindings);

            await statement.finalize();

            return result;
        }

        return this.#execute(callback);
    }

    /**
     * @async
     * @param {string} query
     */
    async createTable(query) {
        const callback = async () => {
            return await this.#db.exec(query);
        }

        return this.#execute(callback);
    }

    /**
     * @async
     * @param {string} query
     * @param {Array<string>} [bindings=[]]
     * @returns {null|Object}
     */
    async insert(query, bindings = []) {
        const callback = async () => {
            return await this.#db.run(query, bindings);
        }

        return this.#execute(callback);
    }

}
