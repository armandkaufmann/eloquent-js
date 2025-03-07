import {Utility} from "../utils/Utility.js";
import {InvalidComparisonOperatorError, TableNotSetError} from "../errors/QueryBuilder/Errors.js";
import {DB} from "../DB.js";

export class Query {
    /** @type {?string} */
    #table = null;
    /** @type {?Model} */
    #model = null;
    /** @type {boolean} */
    #toSql = false;
    /** @type {Array<string>}  */
    #querySelect = [];
    /** @type []  */
    #queryJoin = [];
    /** @type string  */
    #queryWhere = "";
    /** @type {Array<string>}  */
    #queryGroupBy = [];
    /** @type string  */
    #queryHaving = "";
    /** @type {Array<string>}  */
    #queryOrderBy = [];
    /** @type {?number}  */
    #limit = null;
    /** @type {?number}  */
    #offset = null;
    #database = new DB();

    /**
     * @param {string} table
     * @returns Query
     */
    static table(table) {
        return new Query().table(table)
    }

    /**
     * @returns Query
     */
    static toSql() {
        return new Query().toSql()
    }

    /**
     * @param {Model} model
     * @returns Query
     */
    static castResultTo(model) {
        return new Query().castResultTo(model)
    }

    /**
     * @param {string} table
     * @returns Query
     */
    table(table) {
        this.#table = table;
        return this;
    }

    /**
     * @returns Query
     */
    toSql() {
        this.#toSql = true;

        return this;
    }

    /**
     * @param {Model} model
     * @returns Query
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
     * @async
     * @param {Record<string, any>} fields
     * @returns {Boolean}
     * @description Executes the query and returns the newly created record
     */
    async insert(fields) {
        this.#validateTableSet();

        if (this.#toSql) {
            return this.#buildInsertSqlQuery(fields);
        }

        try {
            const statement = this.#buildPreparedInsertSqlQuery(fields);
            await this.#database.insert(statement.query, statement.bindings);
        }catch (e) {
            return false;
        }

        return true;
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
     * @returns Query
     */
    select(...columns) {
        columns.forEach((column) => this.#querySelect.push(column))
        return this;
    }

    /**
     * @param {string} table
     * @param {string} localKey
     * @param {string} operator
     * @param {string} foreignKey
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    join(table, localKey, operator, foreignKey) {
        this.#validateComparisonOperator(operator);

        this.#queryJoin.push(`INNER JOIN ${table} on ${localKey} ${operator} ${foreignKey}`);
        return this;
    }

    /**
     * @param {string} table
     * @param {string} localKey
     * @param {string} operator
     * @param {string} foreignKey
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    leftJoin(table, localKey, operator, foreignKey) {
        this.#validateComparisonOperator(operator);

        this.#queryJoin.push(`LEFT JOIN ${table} on ${localKey} ${operator} ${foreignKey}`);
        return this;
    }

    /**
     * @param {string|{(query: Query)}} column
     * @param {string} operator
     * @param {string|number|null} [value=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
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

        this.#validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere += this.#buildWherePartialQueryString(query);

        return this;
    }

    /**
     * @param {string|{(query: Query)}} column
     * @param {string} operator
     * @param {string|number|null} [value=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
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

        this.#validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere += this.#buildWherePartialQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    whereNull(column) {
        const query = `${column} IS NULL`
        this.#queryWhere += this.#buildWherePartialQueryString(query);

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    orWhereNull(column) {
        const query = `${column} IS NULL`
        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR");

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    whereNotNull(column) {
        const query = `${column} IS NOT NULL`
        this.#queryWhere += this.#buildWherePartialQueryString(query);

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    orWhereNotNull(column) {
        const query = `${column} IS NOT NULL`
        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR");

        return this;
    }

    /**
     * @param {{(query: Query)}} callback
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
     * @returns Query
     */
    whereIn(column, values) {
        this.#queryWhere += this.#buildPartialWhereInQueryString(values, column, false);

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereIn(column, values) {
        this.#queryWhere += this.#buildPartialWhereInQueryString(values, column, false, 'OR');

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    whereNotIn(column, values) {
        this.#queryWhere += this.#buildPartialWhereInQueryString(values, column, true);

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereNotIn(column, values) {
        this.#queryWhere += this.#buildPartialWhereInQueryString(values, column, true, 'OR');

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    whereBetween(column, values) {
        const query = `(${column} BETWEEN ${values[0]} and ${values[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query)

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereBetween(column, values) {
        const query = `(${column} BETWEEN ${values[0]} and ${values[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR")

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    whereNotBetween(column, values) {
        const query = `(${column} NOT BETWEEN ${values[0]} and ${values[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query)

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereNotBetween(column, values) {
        const query = `(${column} NOT BETWEEN ${values[0]} and ${values[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR")

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     */
    whereBetweenColumns(column, columns) {
        const query = `(${column} BETWEEN ${columns[0]} and ${columns[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query)

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     */
    orWhereBetweenColumns(column, columns) {
        const query = `(${column} BETWEEN ${columns[0]} and ${columns[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR")

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     */
    whereNotBetweenColumns(column, columns) {
        const query = `(${column} NOT BETWEEN ${columns[0]} and ${columns[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query)

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     */
    orWhereNotBetweenColumns(column, columns) {
        const query = `(${column} NOT BETWEEN ${columns[0]} and ${columns[1]})`;

        this.#queryWhere += this.#buildWherePartialQueryString(query, "OR")

        return this;
    }

    /**
     * @param {Array<string|number>} values
     * @param {string} column
     * @param {boolean} notIn
     * @param {string|'AND'|'OR'} [condition='AND']
     * @returns string
     */
    #buildPartialWhereInQueryString(values, column, notIn, condition = 'AND') {
        const inArray = values
            .reduce((prev, current, index) => {
                if (index > 0) {
                    return prev += `, ${Utility.valuesToString([current])}`;
                }

                return prev += Utility.valuesToString([current]);
            }, "");

        const query = notIn ? `${column} NOT IN (${inArray})` : `${column} IN (${inArray})`;
        return this.#buildWherePartialQueryString(query, condition);
    }

    /**
     * @param {string} query
     * @param {string|'AND'|'OR'} [condition='AND']
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
     * @returns Query
     */
    groupBy(...columns) {
        columns.forEach((column) => this.#queryGroupBy.push(column))
        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    having(column, operator, value) {
        this.#validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valueToString(value)}`
        this.#queryHaving += this.#buildHavingPartialQueryString(query);

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    orHaving(column, operator, value) {
        this.#validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valueToString(value)}`
        this.#queryHaving += this.#buildHavingPartialQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>} values
     * @returns Query
     */
    havingRaw(expression, values) {
        const query = this.#mergeBindings(expression, values);
        this.#queryHaving += this.#buildHavingPartialQueryString(query);

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>} values
     * @returns Query
     */
    orHavingRaw(expression, values) {
        const query = this.#mergeBindings(expression, values);
        this.#queryHaving += this.#buildHavingPartialQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {string} query
     * @param {Array<String|Number>} bindings
     * @param {String|'?'} [replacer='?']
     * @returns Query
     */
    #mergeBindings(query, bindings, replacer = '?') {
        let result = ``;
        let bindingsIndex = 0;

        for (let i = 0; i < query.length; i++) {
            if (query[i] === replacer) {
                result += Utility.valueToString(bindings[bindingsIndex]);
                bindingsIndex++;
            } else {
                result += query[i];
            }
        }

        return result;
    }

    /**
     * @param {string} query
     * @param {string|'AND'|'OR'} [condition='AND']
     * @returns string
     */
    #buildHavingPartialQueryString(query, condition = 'AND') {
        if (this.#queryHaving) {
            return ` ${condition} ${query}`;
        }

        return `HAVING ${query}`;
    }

    /**
     * @param {string} column
     * @param {"ASC" | "DESC"} [order=DESC]
     * @returns Query
     */
    orderBy(column, order = "DESC") {
        const query = `${column} ${order}`;
        this.#queryOrderBy.push(query)
        return this;
    }

    /**
     * @param {number} number
     * @returns Query
     */
    limit(number) {
        this.#limit = number;
        return this;
    }

    /**
     * @param {number} number
     * @returns Query
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
     * @param {Record<string, any>} fields
     * @returns {Object}
     */
    #buildPreparedInsertSqlQuery(fields) {
        let columns = [];
        let values = [];

        for (const [column, value] of Object.entries(fields)) {
            columns.push(column);
            values.push(value);
        }

        const query = "INSERT INTO " + this.#table + " (" + columns.join(', ') +
            ") VALUES (" + Array(values.length).fill('?').join(', ') + ")";

        return {
            query,
            bindings: values
        }
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
            this.#buildSelectQuery(), this.#buildJoinQuery(), this.#buildWhereQuery(),
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
    #buildJoinQuery() {
        return this.#queryJoin.join(" ");
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
        return this.#queryHaving;
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

    /**
     * @param {string} operator
     * @throws InvalidComparisonOperatorError
     */
    #validateComparisonOperator(operator) {
        const validOperators = ["==", "=", "!=", "<>", ">", "<", ">=", "<=", "!<", "!>", 'like'];

        if (validOperators.filter((valid) => valid === operator?.toLowerCase()).length === 0) {
            throw new InvalidComparisonOperatorError(operator);
        }
    }
}