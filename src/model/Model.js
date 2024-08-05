import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {Utility} from "../utils/Utility.js";

export class Model {
    table = null;
    __querySelect = [];
    __queryWhere = [];
    __queryGroupBy = [];
    __queryOrderBy = [];

    constructor() {
        this.table = this.__getTableName();
    }

    select(...columns) {
        columns.forEach((column) => this.__querySelect.push(column))
        return this;
    }

    where(column, operator, value) {
        const query = column + " " + operator + " " + Utility.valuesToString([value]);
        this.__queryWhere.push(query);
        return this;
    }

    groupBy(...columns) {
        columns.forEach((column) => this.__queryGroupBy.push(column))
        return this;
    }

    orderBy(column, order = "DESC") {
        const query = column + " " + order;
        this.__queryOrderBy.push(query)
        return this;
    }

    __buildSelectQuery() {
        let query = "SELECT ";
        query += this.__querySelect.join(', ') || '*';
        query += ' FROM ' + this.table;

        return query;
    }

    __buildWhereQuery() {
        if (this.__queryWhere.length === 0) {
            return "";
        }

        let query = "WHERE ";
        query += this.__queryWhere.join(' AND ');

        return query;
    }

    __buildGroupByQuery() {
        if (this.__queryGroupBy.length === 0) {
            return "";
        }

        let query = "GROUP BY ";
        query += this.__queryGroupBy.join(', ');

        return query;
    }

    __buildOrderByQuery() {
        if (this.__queryOrderBy.length === 0) {
            return "";
        }

        let query = "ORDER BY ";
        query += this.__queryOrderBy.join(', ');

        return query;
    }

    __getModelName() {
        return this.constructor.name;
    }

    __getTableName() {
        return snakeCase(
            pluralize.plural(this.__getModelName())
        );
    }

    __insert(fields) {
        let columns = [];
        let values = [];

        for (const [column, value] of Object.entries(fields)) {
            columns.push(column);
            values.push(value);
        }

        return "INSERT INTO " + this.table + " (" + columns.join(', ') +
            ") VALUES (" + Utility.valuesToString(values) + ")";
    }
}