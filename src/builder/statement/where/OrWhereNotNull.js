import WhereNotNull from "./WhereNotNull.js";

export default class OrWhereNotNull extends WhereNotNull {

    /**
     * @param {string} column
     */
    constructor(column) {
        super(column, 'OR');
    }
}