import {Utility} from "./utils/Utility.js";
import {TableNotSetError} from "./errors/QueryBuilder/Errors.js";

export class QueryBuilder {
    /** @type {?string} */
    #table = null;
    /** @type {?Model} */
    #model = null;
    /** @type {boolean} */
    #toSql = false;
    /** @type {Array<string>}  */
    #querySelect = [];
    /** @type string  */
    #queryWhere = "";
    /** @type {Array<string>}  */
    #queryGroupBy = [];
    /** @type {Array<string>}  */
    #queryHaving = [];
    /** @type {Array<string>}  */
    #queryOrderBy = [];
    /** @type {?number}  */
    #limit = null;
    /** @type {?number}  */
    #offset = null;

    /**
     * @param {string} table
     * @returns QueryBuilder
     */
    static table(table) {
        return new QueryBuilder().table(table)
    }

    /**
     * @returns QueryBuilder
     */
    static toSql() {
        return new QueryBuilder().toSql()
    }

    /**
     * @param {Model} model
     * @returns QueryBuilder
     */
    static castResultTo(model) {
        return new QueryBuilder().castResultTo(model)
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
     * @returns QueryBuilder
     */
    toSql() {
        this.#toSql = true;

        return this;
    }

    /**
     * @param {Model} model
     * @returns QueryBuilder
     */
    castResultTo(model) {
        this.#model = model;

        return this;
    }

    /**
     * @throws TableNotSetError
     * @returns {string|Model[]|Record<string, any>[]|null}
     * @description Execute and return the result of the current select query. If the ```QueryBuilder``` has a reference to a model
     * then it will return the result cast into the referencing ```Model```. If ```toSql()``` is called beforehand, this will return the full query string.
     * Otherwise, this will
     */
    get() {
        this.#validateTableSet();

        if (this.#toSql) {
            return this.#buildFullSelectSqlQuery();
        }

        //TODO: use DBConn to execute statement
        return null;
    }

    /**
     * @returns {string|Model|Record<string, any>|null}
     * @description Executes the query and retrieves the first result
     */
    first() {
        this.#validateTableSet();

        this.limit(1);

        if (this.#toSql) {
            return this.#buildFullSelectSqlQuery();
        }

        //TODO: use DBConn to execute statement
        return null;
    }

    /**
     * @param {Record<string, any>} fields
     * @returns {string|Model|Record<string, any>|null}
     * @description Executes the query and returns the newly created record
     */
    insert(fields) {
        this.#validateTableSet();

        if (this.#toSql) {
            return this.#buildInsertSqlQuery(fields);
        }

        //TODO: use DBConn to execute statement
        return null;
    }

    /**
     * @param {Record<string, any>} fields
     * @returns {string|Model|Record<string, any>|null}
     */
    update(fields) {
        this.#validateTableSet();

        if (this.#toSql) {
            return this.#buildFullUpdateSqlQuery(fields);
        }

        //TODO: use DBConn to execute statement
        return this;
    }

    /**
     * @returns {boolean|string} - returns true if the record was successfully deleted, false if not.
     */
    delete() {
        this.#validateTableSet();

        if (this.#toSql) {
            return this.#buildFullDeleteSqlQuery();
        }

        //TODO: use DBConn to execute statement
        return true;
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
     * @param {string|{(query: QueryBuilder)}} column
     * @param {string} operator
     * @param {string|number|null} [value=null]
     * @returns QueryBuilder
     */
    where(column, operator, value = null) {
        if (typeof column === "function") {
            this.#handleWhereCallback(column);
            return this;
        }

        if (!value) {
            value = operator;
            operator = '=';
        }

        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere += this.#buildWherePartialQueryString(query);

        return this;
    }

    /**
     * @param {string|{(query: QueryBuilder)}} column
     * @param {string} operator
     * @param {string|number|null} [value=null]
     * @returns QueryBuilder
     */
    orWhere(column, operator, value = null) {
        if (typeof column === "function") {
            this.#handleWhereCallback(column, "OR");
            return this;
        }

        if (!value) {
            value = operator;
            operator = '=';
        }

        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere += this.#buildWherePartialQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {{(query: QueryBuilder)}} callback
     * @param {"AND"|"OR"} [condition="AND"]
     * @returns void
     */
    #handleWhereCallback(callback, condition = "AND"){
        if (this.#queryWhere) {
            this.#queryWhere += ` ${condition} (`
        } else {
            this.#queryWhere += "WHERE (";
        }

        callback(this);

        this.#queryWhere += ")";
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns QueryBuilder
     */
    whereIn(column, values) {
        const inArray = values
            .reduce((prev, current, index) => {
                if (index > 0) {
                    return prev += `, ${Utility.valuesToString([current])}`;
                }

                return prev += Utility.valuesToString([current]);
            }, "");

        const query = `${column} IN (${inArray})`
        this.#queryWhere += this.#buildWherePartialQueryString(query);

        return this;
    }

    /**
     * @param {string} query
     * @param {string|null|'AND'|'OR'} [condition='AND']
     * @returns string
     */
    #buildWherePartialQueryString(query, condition = 'AND') {
        if (this.#queryWhere && (this.#queryWhere.slice(-1) !== '(')) {
            return ` ${condition} ${query}`;
        }

        if (this.#queryWhere && (this.#queryWhere.slice(-1) === '(')) {
            return `${query}`;
        }

        return `WHERE ${query}`;
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
    #buildInsertSqlQuery(fields) {
        let columns = [];
        let values = [];

        for (const [column, value] of Object.entries(fields)) {
            columns.push(column);
            values.push(value);
        }

        return "INSERT INTO " + this.#table + " (" + columns.join(', ') +
            ") VALUES (" + Utility.valuesToString(values) + ")";
    }

    /**
     * @returns string
     */
    #buildFullUpdateSqlQuery(fields) {
        const queryUpdate = this.#buildPartialUpdateSqlQuery(fields);

        const queries = [
            queryUpdate, this.#buildWhereQuery(),
            this.#buildOrderByQuery(), this.#buildLimitQuery(),
            this.#buildOffsetQuery(),
        ];

        return this.#joinQueryStrings(queries)
    }

    #buildPartialUpdateSqlQuery(fields) {
        let pairs = [];

        for (const [column, value] of Object.entries(fields)) {
            pairs.push(`${column} = ${Utility.valuesToString([value])}`)
        }

        return "UPDATE " + this.#table + " SET " + pairs.join(', ');
    }

    /**
     * @returns string
     */
    #buildFullDeleteSqlQuery() {
        const queryDelete = this.#buildPartialDeleteSqlQuery();

        const queries = [
            queryDelete, this.#buildWhereQuery(),
            this.#buildOrderByQuery(), this.#buildLimitQuery(),
            this.#buildOffsetQuery(),
        ];

        return this.#joinQueryStrings(queries)
    }

    #buildPartialDeleteSqlQuery() {
        return "DELETE FROM " + this.#table;
    }

    /**
     * @returns string
     */
    #buildFullSelectSqlQuery() {
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
     * @param {Array<string>} queries
     * @returns string
     */
    #joinQueryStrings(queries) {
        return queries.reduce((result, queryString, index) => {
            return result += queryString !== "" ? (index > 0 ? ' ' : '') + queryString : ''
        }, "");
    }

    /**
     * @throws TableNotSetError
     */
    #validateTableSet() {
        if (!this.#table) {
            throw new TableNotSetError("Query Builder");
        }
    }
}