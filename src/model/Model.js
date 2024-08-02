import {snakeCase} from "change-case";
import pluralize from "pluralize"

export class Model {
    table = null;

    constructor() {
        this.table = this.__getTableName();
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

        return "INSERT INTO " + this.table + "(" + columns.join(', ') +
            ") VALUES (" + this.__valuesToString(values) + ")";
    }

    __valuesToString(values) {
        let result = "";

        values.forEach((value, idx) => {
           if (typeof value === 'string'){
               result += "'" + value + "'";
           } else {
               result += value;
           }

           if (idx < values.length - 1){
               result += ",";
           }
        });

        return result;
    }
}