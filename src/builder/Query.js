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
import From from "./statement/from/From.js";
import SelectRaw from "./statement/select/SelectRaw.js";
import WhereRaw from "./statement/where/WhereRaw.js";
import OrWhereRaw from "./statement/where/OrWhereRaw.js";
import Having from "./statement/having/Having.js";
import OrHaving from "./statement/having/OrHaving.js";
import HavingRaw from "./statement/having/HavingRaw.js";
import OrHavingRaw from "./statement/having/OrHavingRaw.js";
import GroupBy from "./statement/group/GroupBy.js";
import GroupByRaw from "./statement/group/GroupByRaw.js";
import OrderBy from "./statement/order/OrderBy.js";
import OrderByDesc from "./statement/order/OrderByDesc.js";
import WhereAny from "./statement/where/WhereAny.js";
import WhereAll from "./statement/where/WhereAll.js";
import WhereNone from "./statement/where/WhereNone.js";
import Limit from "./statement/limit/Limit.js";
import Offset from "./statement/offset/Offset.js";
import HavingBetween from "./statement/having/HavingBetween.js";
import OrHavingBetween from "./statement/having/OrHavingBetween.js";
import HavingCallback from "./callback/HavingCallback.js";
import Raw from "./statement/raw/Raw.js";
import Separator from "../enums/Separator.js";
import Condition from "../enums/Condition.js";

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
    #queryFrom = new Builder(STATEMENTS.from);
    /** @type {Builder}  */
    #queryJoin = new Builder(STATEMENTS.join);
    /** @type Builder  */
    #queryWhere = new Builder(STATEMENTS.where);
    /** @type Builder  */
    #queryGroupBy = new Builder(STATEMENTS.group);
    /** @type Builder  */
    #queryHaving = new Builder(STATEMENTS.having);
    /** @type {Array<string>}  */
    #queryOrderBy = new Builder(STATEMENTS.orderBy);
    /** @type Builder  */
    #limit = new Builder(STATEMENTS.limit);
    /** @type Builder  */
    #offset = new Builder(STATEMENTS.offset);
    #database = new DB();

    /**
     * @param {string} table
     * @param {string|null} [as=null]
     * @returns Query
     */
    static from(table, as = null) {
        return new Query().from(table, as)
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
     * @param {string} statement
     * @returns Raw
     */
    static raw(statement) {
        return new Raw(statement);
    }

    /**
     * @param {string} table
     * @param {string|null} [as=null]
     * @returns Query
     */
    from(table, as = null) {
        this.#table = table;
        this.#queryFrom.push(new From(table, as))
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
     * @param {...string|Raw} columns
     * @returns Query
     */
    select(...columns) {
        columns.forEach((column) => {
            if (column instanceof Raw) {
                this.#querySelect.push(column.withSeparator(Separator.Comma));
            } else {
                this.#querySelect.push(new Select(column));
            }
        });

        return this;
    }

    /**
     * @param {String} expression
     * @param {Array<String|Number>|null} [bindings=null]
     * @returns Query
     */
    selectRaw(expression, bindings = null) {
        this.#querySelect.push(new SelectRaw(expression, bindings));

        return this;
    }

    /**
     * @returns Query
     */
    distinct() {
        this.#querySelect.setDistinct();

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
     * @param {string|{(query: WhereCallback)}|Raw} column
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

        if (column instanceof Raw) {
            this.#queryWhere.push(column.withSeparator(Separator.And));
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
     * @param {string|{(query: WhereCallback)}|Raw} column
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

        if (column instanceof Raw) {
            this.#queryWhere.push(column.withSeparator(Separator.Or));
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
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     * @returns Query
     */
    whereRaw(expression, bindings = null) {
        this.#queryWhere.push(new WhereRaw(expression, bindings));

        return this;
    }

    /**
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     * @returns Query
     */
    orWhereRaw(expression, bindings = null) {
        this.#queryWhere.push(new OrWhereRaw(expression, bindings));

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
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @returns Query
     */
    whereAny(columns, operator, value) {
        this.#queryWhere.push(new WhereAny(columns, operator, value));

        return this;
    }

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @returns Query
     */
    whereAll(columns, operator, value) {
        this.#queryWhere.push(new WhereAll(columns, operator, value));

        return this;
    }

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @returns Query
     */
    whereNone(columns, operator, value) {
        this.#queryWhere.push(new WhereNone(columns, operator, value));

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
        columns.forEach((column) => {
            this.#queryGroupBy.push(new GroupBy(column));
        });

        return this;
    }

    /**
     * @param {string} expression
     * @returns Query
     */
    groupByRaw(expression) {
        this.#queryGroupBy.push(new GroupByRaw(expression));

        return this;
    }

    /**
     * @param {string|{(query: HavingCallback)}|Raw} column
     * @param {string|number} operator
     * @param {string|number|null} [value=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    having(column, operator, value = null) {
        if (typeof column === "function") {
            this.#handleHavingCallback(column);
            return this;
        }

        if (column instanceof Raw) {
            this.#queryHaving.push(column.withSeparator(Separator.And));
            return this;
        }

        if (!value) {
            value = operator;
            operator = '=';
        }

        Validation.validateComparisonOperator(operator);

        this.#queryHaving.push(new Having(column, operator, value));

        return this;
    }

    /**
     * @param {string|{(query: HavingCallback)}|Raw} column
     * @param {string|number} operator
     * @param {string|number|null} [value=null]
     * @returns Query
     * @throws InvalidComparisonOperatorError
     */
    orHaving(column, operator, value = null) {
        if (typeof column === "function") {
            this.#handleHavingCallback(column, "OR");
            return this;
        }

        if (column instanceof Raw) {
            this.#queryHaving.push(column.withSeparator(Separator.Or));
            return this;
        }

        if (!value) {
            value = operator;
            operator = '=';
        }

        Validation.validateComparisonOperator(operator);

        this.#queryHaving.push(new OrHaving(column, operator, value));

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>|null} [bindings=null]
     * @returns Query
     */
    havingRaw(expression, bindings = null) {
        this.#queryHaving.push(new HavingRaw(expression, bindings));

        return this;
    }

    /**
     * @param {string} expression
     * @param {Array<String|Number>|null} [bindings=null]
     * @returns Query
     */
    orHavingRaw(expression, bindings = null) {
        this.#queryHaving.push(new OrHavingRaw(expression, bindings));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<String|Number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    havingBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryHaving.push(new HavingBetween(column, values));

        return this;
    }

    /**
     * @param {string} column
     * @param {Array<String|Number>} values
     * @returns Query
     * @throws InvalidBetweenValueArrayLength
     */
    orHavingBetween(column, values) {
        Validation.validateBetweenArrayLength(values);

        this.#queryHaving.push(new OrHavingBetween(column, values));

        return this;
    }

    /**
     * @param {string|Raw} column
     * @param {"ASC"|"DESC"} [order=ASC]
     * @returns Query
     */
    orderBy(column, order = "ASC") {
        if (column instanceof Raw) {
            this.#queryOrderBy.push(column.withSeparator(Separator.Comma).appendStatement(order));
            return this;
        }

        this.#queryOrderBy.push(new OrderBy(column, order));
        return this;
    }

    /**
     * @param {string|Raw} column
     * @returns Query
     */
    orderByDesc(column) {
        if (column instanceof Raw) {
            this.#queryOrderBy.push(column.withSeparator(Separator.Comma).appendStatement("DESC"));
            return this;
        }

        this.#queryOrderBy.push(new OrderByDesc(column));
        return this;
    }

    /**
     * @param {string} expression
     * @returns Query
     */
    orderByRaw(expression) {
        this.#queryOrderBy.push(new Raw(expression).withSeparator(Separator.Comma));
        return this;
    }

    /**
     * @param {number} number
     * @returns Query
     */
    limit(number) {
        this.#limit.push(new Limit(number));
        return this;
    }

    /**
     * @param {number} number
     * @returns Query
     */
    offset(number) {
        this.#offset.push(new Offset(number));
        return this;
    }

    /**
     * @param {{(query: WhereCallback)}} callback
     * @param {"AND"|"OR"} [condition="AND"]
     * @returns void
     */
    #handleWhereCallback(callback, condition = Condition.And) {
        const group = new Group(condition);
        const whereCallback = new WhereCallback(group);

        callback(whereCallback);

        this.#queryWhere.push(group);
    }

    /**
     * @param {{(query: HavingCallback)}} callback
     * @param {"AND"|"OR"} [condition="AND"]
     * @returns void
     */
    #handleHavingCallback(callback, condition = Condition.And) {
        const group = new Group(condition);
        const whereCallback = new HavingCallback(group);

        callback(whereCallback);

        this.#queryHaving.push(group);
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
            this.#queryOrderBy.toString(), this.#limit.toString(),
            this.#offset.toString(),
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
            this.#queryOrderBy.toString(), this.#limit.toString(),
            this.#offset.toString(),
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
            this.#querySelect.toString(), this.#queryFrom.toString(),
            this.#queryJoin.toString(), this.#queryWhere.toString(),
            this.#queryGroupBy.toString(), this.#queryHaving.toString(),
            this.#queryOrderBy.toString(), this.#limit.toString(),
            this.#offset.toString(),
        ];

        return this.#joinQueryStrings(queries);
    }

    /**
     * @param {Array<string>} queries
     * @returns string
     */
    #joinQueryStrings(queries) {
        return queries
            .reduce((result, queryString, index) => {
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