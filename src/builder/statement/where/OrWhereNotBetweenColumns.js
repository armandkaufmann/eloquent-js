import WhereNotBetweenColumns from "./WhereNotBetweenColumns.js";

export default class OrWhereNotBetweenColumns extends WhereNotBetweenColumns {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     */
    constructor(column, columns) {
        super(column, columns, 'OR');
    }
}