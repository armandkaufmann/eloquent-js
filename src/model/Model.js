import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {QueryBuilder} from "./QueryBuilder.js";

export class Model {
    table = null;
    #queryBuilder = null;

    constructor() {
        this.table = this.__getTableName();
        this.#queryBuilder = new QueryBuilder().from(this.table);
    }

    create(fields) {
        return this.#queryBuilder
            .insert(fields);
    }

    select(...columns) {
        this.#queryBuilder
            .select(...columns);

        return this;
    }

    where(column, operator, value) {
        this.#queryBuilder
            .where(column, operator, value);

        return this;
    }

    groupBy(...columns) {
        this.#queryBuilder
            .groupBy(...columns);

        return this;
    }

    having(column, operator, value) {
        this.#queryBuilder
            .having(column, operator, value);

        return this;
    }

    orderBy(column, order = "DESC") {
        this.#queryBuilder
            .orderBy(column, order);

        return this;
    }

    __getModelName() {
        return this.constructor.name;
    }

    __getTableName() {
        return snakeCase(
            pluralize.plural(this.__getModelName())
        );
    }
}