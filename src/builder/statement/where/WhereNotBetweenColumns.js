import {Base} from "../Base.js";

export default class WhereNotBetweenColumns extends Base {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     * @param {String} [separator='AND']
     */
    constructor(column, columns, separator = 'AND') {
        const query = `${column} < ${columns[0]} AND ${column} > ${columns[1]}`;

        super([], query, separator);
    }
}