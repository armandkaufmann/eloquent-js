import {Base} from "../Base.js";

export default class WhereNull extends Base {

    /**
     * @param {String} column
     * @param {String} [condition='IS NULL']
     * @param {String} [separator='AND']
     */
    constructor(column, condition = 'IS NULL', separator = 'AND') {
        const query = `${column} ${condition}`;

        super([], query, separator);
    }
}