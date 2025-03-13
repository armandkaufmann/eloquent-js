import WhereBetweenColumns from "./WhereBetweenColumns.js";

export default class WhereNotBetweenColumns extends WhereBetweenColumns {

    /**
     * @param {String} column
     * @param {Array<string>} columns
     * @param {String} separator
     */
    constructor(column, columns, separator = 'AND') {
        super(column, columns, 'NOT BETWEEN', separator);
    }
}