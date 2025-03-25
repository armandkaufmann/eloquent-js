import {Base} from "../Base.js";

export default class WhereColumn extends Base {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String} comparisonColumn
     * @param {String} [separator='AND']
     */
    constructor(column, operator, comparisonColumn, separator = 'AND') {
        const query = `${column} ${operator} ${comparisonColumn}`;

        super([], query, separator);
    }
}