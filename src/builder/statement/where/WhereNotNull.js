import WhereNull from "./WhereNull.js";

export default class WhereNotNull extends WhereNull {

    /**
     * @param {String} column
     * @param {String} [separator='AND']
     */
    constructor(column, separator = 'AND') {
        super(column, 'IS NOT NULL', separator);
    }
}