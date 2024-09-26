import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {QueryBuilder} from "./QueryBuilder.js";

export class Model {
    table = null;
    #queryBuilder = null;

    constructor() {
        this.table = this._getTableName();
        this.#queryBuilder = new QueryBuilder();
    }

    static all() {
        return new this().get();
    }

    static first(limit = null) {
        return new this().first(limit);
    }

    first(limit = null) {
        return this.#queryBuilder
            .from(this.table)
            .limit(limit || 1)
            .toSql();
    }

    get() {
        return this.#queryBuilder
            .from(this.table)
            .toSql();
    }

    create(fields) {
        return this.#queryBuilder
            .from(this.table)
            .insert(fields);
    }

    select(...columns) {
        this.#queryBuilder
            .from(this.table)
            .select(...columns);

        return this;
    }

    where(column, operator, value) {
        this.#queryBuilder
            .from(this.table)
            .where(column, operator, value);

        return this;
    }

    groupBy(...columns) {
        this.#queryBuilder
            .from(this.table)
            .groupBy(...columns);

        return this;
    }

    having(column, operator, value) {
        this.#queryBuilder
            .from(this.table)
            .having(column, operator, value);

        return this;
    }

    orderBy(column, order = "DESC") {
        this.#queryBuilder
            .from(this.table)
            .orderBy(column, order);

        return this;
    }

    _getModelName() {
        return this.constructor.name;
    }

    _getTableName() {
        return snakeCase(
            pluralize.plural(this._getModelName())
        );
    }
}