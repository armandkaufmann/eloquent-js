import {Utility} from "./utils/Utility.js";
import {TableNotSetError} from "./errors/QueryBuilder/Errors.js";

export class QueryBuilder {
    #table = null;
    /** @type []  */
    #querySelect = [];
    /** @type []  */
    #queryWhere = [];
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
     * @param {Object} fields
     * @returns QueryBuilder
     */
    insert(fields) {
        this.#queryInsert = this.#buildInsertQuery(fields);

        return this;
    }

    /**
     * @param {Object} fields
     * @returns QueryBuilder
     */
    update(fields) {
        this.#queryUpdate = this.#buildUpdateQuery(fields);

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
        //todo: push where sql into
        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere.push(query);
        return this;
    }

    /**
     * @param {...string} columns
     * @returns Model
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

    #buildUpdateQuery(fields) {
        let pairs = [];

        for (const [column, value] of Object.entries(fields)) {
            pairs.push(`${column}=${value}`)
        }

        return "UPDATE " + this.#table + " SET " + pairs.join(', ') + " " + this.#buildWhereQuery();
    }

    #buildFullSelectQuery() {
        let result = "";

        [
            this.#buildSelectQuery(), this.#buildWhereQuery(),
            this.#buildGroupByQuery(), this.#buildHavingQuery(),
            this.#buildOrderByQuery(), this.#buildLimitQuery(),
        ].forEach((queryString, idx) => {
            queryString !== "" ? result += (idx > 0 ? ' ' : '') + queryString : ''
        });

        return result;
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
        if (this.#queryWhere.length === 0) {
            return "";
        }

        let query = "WHERE ";
        query += this.#queryWhere.join(' AND ');

        return query;
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
}