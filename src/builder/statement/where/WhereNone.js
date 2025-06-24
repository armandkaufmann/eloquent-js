import {Base} from "../Base.js";

export default class WhereNone extends Base {

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [separator='AND']
     */
    constructor(columns, operator, value, separator = 'AND') {
        let query = [];
        let bindings = [];

        columns.forEach(function (column) {
            query.push(`${column} ${operator} ?`);
            bindings.push(value);
        });

        let queryString = query.join(' OR ');
        queryString = `NOT (${queryString})`;

        super(bindings, queryString, separator);
    }
}