import {Utility} from "./utils/Utility.js";
import {TableNotSetError} from "./errors/QueryBuilder/Errors.js";

export class QueryBuilder {
    #table = null;
    /** @type []  */
    #querySelect = [];
    /** @type string  */
    #queryWhere = "";
    /** @type []  */
    #queryGroupBy = [];
    /** @type []  */
    #queryHaving = [];
    /** @type []  */
    #queryOrderBy = [];
    /** @type string  */
    #queryInsert = "";
    /** @type string  */
    #queryUpdate = "";
    #limit = null;
    #offset = null;

    /**
     * @param {string} table
     * @returns QueryBuilder
     */
    static table(table) {
        return new QueryBuilder().table(table)
    }

    /**
     * @returns string
     */
    toSql() {
        if (!this.#table) {
            throw new TableNotSetError("Query Builder");
        }

        if (this.#queryInsert) {
            return this.#queryInsert;
        }

        if (this.#queryUpdate) {
            return this.#buildFullUpdateQuery();
        }

        return this.#buildFullSelectQuery();
    }

    /**
     * @param {string} table
     * @returns QueryBuilder
     */
    table(table) {
        this.#table = table;
        return this;
    }

    /**
     * @param {Record<string, any>} fields
     * @returns QueryBuilder
     */
    insert(fields) {
        this.#queryInsert = this.#buildInsertQuery(fields);

        return this;
    }

    /**
     * @param {Record<string, any>} fields
     * @returns QueryBuilder
     */
    update(fields) {
        this.#queryUpdate = this.#saveUpdateQuery(fields);

        return this;
    }

    /**
     * @param {...string} columns
     * @returns QueryBuilder
     */
    select(...columns) {
        columns.forEach((column) => this.#querySelect.push(column))
        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns QueryBuilder
     */
    where(column, operator, value) {
        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        if (this.#queryWhere) {
            this.#queryWhere += ` AND ${query}`;
        } else {
            this.#queryWhere += `WHERE ${query}`;
        }

        return this;
    }

    /**
     * @param {...string} columns
     * @returns QueryBuilder
     */
    groupBy(...columns) {
        columns.forEach((column) => this.#queryGroupBy.push(column))
        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns QueryBuilder
     */
    having(column, operator, value) {
        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryHaving.push(query);
        return this;
    }

    /**
     * @param {string} column
     * @param {"ASC" | "DESC"} [order=DESC]
     * @returns QueryBuilder
     */
    orderBy(column, order = "DESC") {
        const query = `${column} ${order}`;
        this.#queryOrderBy.push(query)
        return this;
    }

    /**
     * @param {number} number
     * @returns QueryBuilder
     */
    limit(number) {
        this.#limit = number;
        return this;
    }

    /**
     * @param {number} number
     * @returns QueryBuilder
     */
    offset(number) {
        this.#offset = number;
        return this;
    }

    /**
     * @param {Record<string, any>} fields
     * @returns string
     */
    #buildInsertQuery(fields) {
        let columns = [];
        let values = [];

        for (const [column, value] of Object.entries(fields)) {
            columns.push(column);
            values.push(value);
        }

        return "INSERT INTO " + this.#table + " (" + columns.join(', ') +
            ") VALUES (" + Utility.valuesToString(values) + ")";
    }

    #saveUpdateQuery(fields) {
        let pairs = [];

        for (const [column, value] of Object.entries(fields)) {
            pairs.push(`${column} = ${Utility.valuesToString([value])}`)
        }

        return "UPDATE " + this.#table + " SET " + pairs.join(', ');
    }

    /**
     * @returns string
     */
    #buildFullUpdateQuery() {
        const queries = [
            this.#queryUpdate, this.#buildWhereQuery(),
            this.#buildOrderByQuery(), this.#buildLimitQuery(),
            this.#buildOffsetQuery(),
        ];

        return this.#joinQueryStrings(queries)
    }

    #buildFullSelectQuery() {
        const queries = [
            this.#buildSelectQuery(), this.#buildWhereQuery(),
            this.#buildGroupByQuery(), this.#buildHavingQuery(),
            this.#buildOrderByQuery(), this.#buildLimitQuery(),
            this.#buildOffsetQuery(),
        ];

        return this.#joinQueryStrings(queries);
    }

    /**
     * @returns string
     */
    #buildSelectQuery() {
        let query = "SELECT ";
        query += this.#querySelect.join(', ') || '*';
        query += ' FROM ' + this.#table;

        return query;
    }

    /**
     * @returns string
     */
    #buildWhereQuery() {
        return this.#queryWhere;
    }

    /**
     * @returns string
     */
    #buildGroupByQuery() {
        if (this.#queryGroupBy.length === 0) {
            return "";
        }

        let query = "GROUP BY ";
        query += this.#queryGroupBy.join(', ');

        return query;
    }

    /**
     * @returns string
     */
    #buildHavingQuery() {
        if (this.#queryHaving.length === 0) {
            return "";
        }

        let query = "HAVING ";
        query += this.#queryHaving.join(' AND ');

        return query;
    }

    /**
     * @returns string
     */
    #buildOrderByQuery() {
        if (this.#queryOrderBy.length === 0) {
            return "";
        }

        let query = "ORDER BY ";
        query += this.#queryOrderBy.join(', ');

        return query;
    }

    /**
     * @returns string
     */
    #buildLimitQuery() {
        if (!this.#limit) {
            return "";
        }

        return "LIMIT " + this.#limit;
    }

    /**
     * @returns string
     */
    #buildOffsetQuery() {
        if (!this.#offset) {
            return "";
        }

        return "OFFSET " + this.#offset;
    }

    /**
     * @param {string[]} queries
     * @returns string
     */
    #joinQueryStrings(queries) {
        return queries.reduce((result, queryString, index) => {
            return result += queryString !== "" ? (index > 0 ? ' ' : '') + queryString : ''
        }, "");
    }
}