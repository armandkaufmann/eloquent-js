import {Utility} from "../utils/Utility.js";

export class QueryBuilder {
    table = null;
    #querySelect = [];
    #queryWhere = [];
    #queryGroupBy = [];
    #queryHaving = [];
    #queryOrderBy = [];
    #limit = null;

    static table(table) {
        return new QueryBuilder().from(table)
    }

    from(table) {
        this.table = table;
        return this;
    }

    insert(fields) {
        let columns = [];
        let values = [];

        for (const [column, value] of Object.entries(fields)) {
            columns.push(column);
            values.push(value);
        }

        return "INSERT INTO " + this.table + " (" + columns.join(', ') +
            ") VALUES (" + Utility.valuesToString(values) + ")";
    }

    select(...columns) {
        columns.forEach((column) => this.#querySelect.push(column))
        return this;
    }

    where(column, operator, value) {
        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryWhere.push(query);
        return this;
    }

    groupBy(...columns) {
        columns.forEach((column) => this.#queryGroupBy.push(column))
        return this;
    }

    having(column, operator, value) {
        const query = `${column} ${operator} ${Utility.valuesToString([value])}`
        this.#queryHaving.push(query);
        return this;
    }

    orderBy(column, order = "DESC") {
        const query = `${column} ${order}`;
        this.#queryOrderBy.push(query)
        return this;
    }

    limit(number) {
        this.#limit = number;
        return this;
    }

    _buildSelectQuery() {
        let query = "SELECT ";
        query += this.#querySelect.join(', ') || '*';
        query += ' FROM ' + this.table;

        return query;
    }

    _buildWhereQuery() {
        if (this.#queryWhere.length === 0) {
            return "";
        }

        let query = "WHERE ";
        query += this.#queryWhere.join(' AND ');

        return query;
    }

    _buildGroupByQuery() {
        if (this.#queryGroupBy.length === 0) {
            return "";
        }

        let query = "GROUP BY ";
        query += this.#queryGroupBy.join(', ');

        return query;
    }

    _buildHavingQuery() {
        if (this.#queryHaving.length === 0) {
            return "";
        }

        let query = "HAVING ";
        query += this.#queryHaving.join(' AND ');

        return query;
    }

    _buildOrderByQuery() {
        if (this.#queryOrderBy.length === 0) {
            return "";
        }

        let query = "ORDER BY ";
        query += this.#queryOrderBy.join(', ');

        return query;
    }

    _buildLimitQuery() {
        if (!this.#limit) {
            return "";
        }

        return "LIMIT " + this.#limit;
    }
}