import {Base, STATEMENTS} from "../Base.js";

export default class WhereNotNull extends Base {

    /**
     * @param {String} column
     * @param {String} [separator='AND']
     */
    constructor(column, separator = 'AND') {
        const query = `${column} IS NOT NULL`;

        super([], query, STATEMENTS.where, separator);
    }
}