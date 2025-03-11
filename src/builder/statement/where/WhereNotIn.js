import WhereIn from "./WhereIn.js";

export default class WhereNotIn extends WhereIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = 'AND') {
        super(column, values, 'NOT IN', separator);
    }
}