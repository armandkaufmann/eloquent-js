import {Utility} from "../utils/Utility.js";
import {
    InvalidBetweenValueArrayLength,
    InvalidComparisonOperatorError,
    TableNotSetError
} from "../errors/QueryBuilder/Errors.js";
import {DB} from "../DB.js";
import Builder from "./statement/Builder.js";
import {STATEMENTS} from "./statement/Base.js";
import Where from "./statement/where/Where.js";
import OrWhere from "./statement/where/OrWhere.js";
import WhereNull from "./statement/where/WhereNull.js";
import OrWhereNull from "./statement/where/OrWhereNull.js";
import WhereNotNull from "./statement/where/WhereNotNull.js";
import OrWhereNotNull from "./statement/where/OrWhereNotNull.js";
import WhereIn from "./statement/where/WhereIn.js";
import OrWhereIn from "./statement/where/OrWhereIn.js";
import WhereNotIn from "./statement/where/WhereNotIn.js";
import OrWhereNotIn from "./statement/where/OrWhereNotIn.js";
import WhereBetween from "./statement/where/WhereBetween.js";
import OrWhereBetween from "./statement/where/OrWhereBetween.js";
import WhereNotBetween from "./statement/where/WhereNotBetween.js";
import OrWhereNotBetween from "./statement/where/OrWhereNotBetween.js";
import Select from "./statement/select/Select.js";
import Group from "./statement/Group.js";
import WhereBetweenColumns from "./statement/where/WhereBetweenColumns.js";
import OrWhereBetweenColumns from "./statement/where/OrWhereBetweenColumns.js";
import WhereNotBetweenColumns from "./statement/where/WhereNotBetweenColumns.js";
import OrWhereNotBetweenColumns from "./statement/where/OrWhereNotBetweenColumns.js";
import WhereColumn from "./statement/where/WhereColumn.js";
import OrWhereColumn from "./statement/where/OrWhereColumn.js";
import InnerJoin from "./statement/join/InnerJoin.js";
import LeftJoin from "./statement/join/LeftJoin.js";
import CrossJoin from "./statement/join/CrossJoin.js";
import Validation from "../utils/Validation.js";
import WhereCallback from "./callback/WhereCallback.js";

export class Query {
    /** @type {?string} */
    #table = null;
    /** @type {?Model} */
    #model = null;
    /** @type {boolean} */
    #toSql = false;
    /** @type {Builder}  */
    #querySelect = new Builder(STATEMENTS.select);
    /** @type {Builder}  */
    #queryJoin = new Builder(STATEMENTS.join);
    /** @type Builder  */
    #queryWhere = new Builder(STATEMENTS.where);
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
        } catch (e) {
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
        this.#querySelect.push(new Select([...columns]));

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
        Validation.validateComparisonOperator(operator);

        this.#queryJoin.push(new InnerJoin(table, localKey, operator, foreignKey));

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
        Validation.validateComparisonOperator(operator);

        this.#queryJoin.push(new LeftJoin(table, localKey, operator, foreignKey));

        return this;
    }

    /**
     * @param {string} table
     * @returns Query
     */
    crossJoin(table) {
        this.#queryJoin.push(new CrossJoin(table));

        return this;
    }

    /**
     * @param {string|{(query: WhereCallback)}} column
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

        Validation.validateComparisonOperator(operator);

        this.#queryWhere.push(new Where(column, operator, value));

        return this;
    }

    /**
     * @param {string|{(query: WhereCallback)}} column
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

        Validation.validateComparisonOperator(operator);

        this.#queryWhere.push(new OrWhere(column, operator, value));

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    whereNull(column) {
        this.#queryWhere.push(new WhereNull(column));

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    orWhereNull(column) {
        this.#queryWhere.push(new OrWhereNull(column));

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    whereNotNull(column) {
        this.#queryWhere.push(new WhereNotNull(column));

        return this;
    }

    /**
     * @param {string} column
     * @returns Query
     */
    orWhereNotNull(column) {
        this.#queryWhere.push(new OrWhereNotNull(column));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    whereIn(column, values) {
        this.#queryWhere.push(new WhereIn(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereIn(column, values) {
        this.#queryWhere.push(new OrWhereIn(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    whereNotIn(column, values) {
        this.#queryWhere.push(new WhereNotIn(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     */
    orWhereNotIn(column, values) {
        this.#queryWhere.push(new OrWhereNotIn(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    whereBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryWhere.push(new WhereBetween(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    orWhereBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryWhere.push(new OrWhereBetween(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    whereNotBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryWhere.push(new WhereNotBetween(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string|number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    orWhereNotBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryWhere.push(new OrWhereNotBetween(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string|null} [comparisonColumn=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    whereColumn(column, operator, comparisonColumn = null) {
        if (!comparisonColumn) {
            comparisonColumn = operator;
            operator = '=';
        }

        Validation.validateComparisonOperator(operator);

        this.#queryWhere.push(new WhereColumn(column, operator, comparisonColumn));

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string|null} [comparisonColumn=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    orWhereColumn(column, operator, comparisonColumn = null) {
        if (!comparisonColumn) {
            comparisonColumn = operator;
            operator = '=';
        }

        Validation.validateComparisonOperator(operator);

        this.#queryWhere.push(new OrWhereColumn(column, operator, comparisonColumn));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    whereBetweenColumns(column, columns) {
        Validation.validateBetweenArrayLength(columns);

        this.#queryWhere.push(new WhereBetweenColumns(column, columns));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    orWhereBetweenColumns(column, columns) {
        Validation.validateBetweenArrayLength(columns);

        this.#queryWhere.push(new OrWhereBetweenColumns(column, columns));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    whereNotBetweenColumns(column, columns) {
        Validation.validateBetweenArrayLength(columns);

        this.#queryWhere.push(new WhereNotBetweenColumns(column, columns));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<string>} columns
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    orWhereNotBetweenColumns(column, columns) {
        Validation.validateBetweenArrayLength(columns);

        this.#queryWhere.push(new OrWhereNotBetweenColumns(column, columns));

        return this;
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
        Validation.validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valueToString(value)}`
        this.#queryHaving += this.#buildPartialHavingQueryString(query);

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
        Validation.validateComparisonOperator(operator);

        const query = `${column} ${operator} ${Utility.valueToString(value)}`
        this.#queryHaving += this.#buildPartialHavingQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>} values
     * @returns Query
     */
    havingRaw(expression, values) {
        const query = this.#mergeBindings(expression, values);
        this.#queryHaving += this.#buildPartialHavingQueryString(query);

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>} values
     * @returns Query
     */
    orHavingRaw(expression, values) {
        const query = this.#mergeBindings(expression, values);
        this.#queryHaving += this.#buildPartialHavingQueryString(query, 'OR');

        return this;
    }

    /**
     * @param {string} query
     * @param {Array<String|Number>} bindings
     * @param {String|'?'} [replacer='?']
     * @returns String
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
    #buildPartialHavingQueryString(query, condition = 'AND') {
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
     * @param {{(query: WhereCallback)}} callback
     * @param {"AND"|"OR"} [condition="AND"]
     * @returns void
     */
    #handleWhereCallback(callback, condition = "AND") {
        const group = new Group(condition);
        const whereCallback = new WhereCallback(group);

        callback(whereCallback);

        this.#queryWhere.push(group);
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
            queryUpdate, this.#queryWhere.toString(),
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
            queryDelete, this.#queryWhere.toString(),
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
            this.#buildSelectQuery(), this.#queryJoin.toString(), this.#queryWhere.toString(),
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
        return `${this.#querySelect.toString()} FROM ${this.#table}`;
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
}