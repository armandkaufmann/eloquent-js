import {Base} from "../Base.js";

export default class HavingBetween extends Base {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = 'AND') {
        const query = `${column} BETWEEN ? AND ?`;

        super(values, query, separator);
    }
}