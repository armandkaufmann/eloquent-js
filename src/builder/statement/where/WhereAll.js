import WhereAny from "./WhereAny.js";

export default class WhereAll extends WhereAny {

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [separator='AND']
     */
    constructor(columns, operator, value, separator = 'AND') {
        super(columns, operator, value, 'AND', separator);
    }
}