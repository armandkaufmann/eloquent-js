import {Base, STATEMENTS} from "../Base.js";

export default class WhereBetweenColumns extends Base {

    /**
     * @param {String} column
     * @param {Array<string>} columns
     * @param {String} [separator='AND']
     */
    constructor(column, columns, separator = 'AND') {
        const query = `${column} BETWEEN ${columns[0]} AND ${columns[1]}`;

        super([], query, STATEMENTS.where, separator);
    }
}