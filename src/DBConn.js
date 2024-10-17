import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export class DBConn {
    #db = null;

    async connect() {
        this.#db = await open({
            filename: '/tmp/database.db',
            driver: sqlite3.Database
        });
    }
}
