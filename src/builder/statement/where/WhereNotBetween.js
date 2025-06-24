import WhereBetween from "./WhereBetween.js";

export default class WhereNotBetween extends WhereBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = 'AND') {
        super(column, values, 'NOT BETWEEN', separator);
    }
}