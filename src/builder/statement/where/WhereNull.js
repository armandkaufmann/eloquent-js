import {Base, STATEMENTS} from "../Base.js";

export default class WhereNull extends Base {

    /**
     * @param {String} column
     * @param {String} [separator='AND']
     */
    constructor(column, separator = 'AND') {
        const query = `${column} IS NULL`;

        super([], query, STATEMENTS.where, separator);
    }
}