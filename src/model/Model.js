import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {Utility} from "../utils/Utility.js";

export class Model {
    table = null;
    __queryWhere = [];
    __querySelect = [];
    __queryOrderBy = [];

    constructor() {
        this.table = this.__getTableName();
    }

    where(column, operator, value) {
        const query = column + " " + operator + " " + Utility.valuesToString([value]);
        this.__queryWhere.push(query);
        return this;
    }

    select(...columns) {
        columns.forEach((column) => this.__querySelect.push(column))
        return this;
    }

    orderBy(column, order = "DESC") {
        const query = column + " " + order;
        this.__queryOrderBy.push(query)
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