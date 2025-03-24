import WhereNotBetween from "./WhereNotBetween.js";

export default class OrWhereNotBetween extends WhereNotBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     */
    constructor(column, values) {
        super(column, values, 'OR');
    }
}