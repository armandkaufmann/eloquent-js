import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class WhereAny extends Base {

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [condition='OR']
     * @param {String} [separator='AND']
     */
    constructor(columns, operator, value, condition = 'OR', separator = Separator.And) {
        let query = [];
        let bindings = [];

        columns.forEach(function (column) {
            query.push(`${Utility.escapeColumnString(column)} ${operator} ?`);
            bindings.push(value);
        });

        let queryString = query.join(` ${condition} `);
        queryString = `(${queryString})`;

        super(bindings, queryString, separator);
    }
}