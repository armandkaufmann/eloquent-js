import {Base} from "../Base.js";

export default class WhereAny extends Base {

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [condition='OR']
     * @param {String} [separator='AND']
     */
    constructor(columns, operator, value, condition = 'OR', separator = 'AND') {
        let query = [];
        let bindings = [];

        columns.forEach(function (column) {
            query.push(`${column} ${operator} ?`);
            bindings.push(value);
        });

        let queryString = query.join(` ${condition} `);
        queryString = `(${queryString})`;

        super(bindings, queryString, separator);
    }
}