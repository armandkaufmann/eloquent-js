import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {QueryBuilder} from "./QueryBuilder.js";

export class Model {
    table = null;
    /** @type QueryBuilder  */
    #queryBuilder = new QueryBuilder();

    constructor() {
        this.table = this._getTableName();
    }

    /**
     * @param {Object<string, string | number>} fields
     * @returns string
     */
    static create(fields) {
        return new this().create(fields);
    }

    /**
     * @returns string
     */
    static all() {
        return new this().get();
    }

    /**
     * @param {number} [limit=1]
     * @returns string
     */
    static first(limit = 1) {
        return new this().first(limit);
    }

    /**
     * @param {number} [limit=1]
     * @returns string
     */
    first(limit = 1) {
        return this.#queryBuilder
            .table(this.table)
            .limit(limit)
            .toSql();
    }

    /**
     * @returns string
     */
    get() {
        return this.#queryBuilder
            .table(this.table)
            .toSql();
    }

    /**
     * @param {Object<string, string | number>} fields
     * @returns string
     */
    create(fields) {
        return this.#queryBuilder
            .table(this.table)
            .insert(fields);
    }

    /**
     * @param {...string} columns
     * @returns Model
     */
    select(...columns) {
        this.#queryBuilder
            .table(this.table)
            .select(...columns);

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Model
     */
    where(column, operator, value) {
        this.#queryBuilder
            .table(this.table)
            .where(column, operator, value);

        return this;
    }

    /**
     * @param {...string} columns
     * @returns Model
     */
    groupBy(...columns) {
        this.#queryBuilder
            .table(this.table)
            .groupBy(...columns);

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Model
     */
    having(column, operator, value) {
        this.#queryBuilder
            .table(this.table)
            .having(column, operator, value);

        return this;
    }

    /**
     * @param {string} column
     * @param {"ASC" | "DESC"} [order=DESC]
     * @returns Model
     */
    orderBy(column, order = "DESC") {
        this.#queryBuilder
            .table(this.table)
            .orderBy(column, order);

        return this;
    }

    /**
     * @returns string
     */
    _getModelName() {
        return this.constructor.name;
    }

    /**
     * @returns string
     */
    _getTableName() {
        return snakeCase(
            pluralize.plural(this._getModelName())
        );
    }
}