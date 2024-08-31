import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {QueryBuilder} from "./QueryBuilder.js";

export class Model {
    table = null;
    __queryBuilder = null;

    constructor() {
        this.table = this.__getTableName();
        this.__queryBuilder = new QueryBuilder().from(this.table);
    }

    create(fields) {
        return this.__queryBuilder
            .insert(fields);
    }

    select(...columns) {
        this.__queryBuilder
            .select(...columns);

        return this;
    }

    where(column, operator, value) {
        this.__queryBuilder
            .where(column, operator, value);

        return this;
    }

    groupBy(...columns) {
        this.__queryBuilder
            .groupBy(...columns);

        return this;
    }

    having(column, operator, value) {
        this.__queryBuilder
            .having(column, operator, value);

        return this;
    }

    orderBy(column, order = "DESC") {
        this.__queryBuilder
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