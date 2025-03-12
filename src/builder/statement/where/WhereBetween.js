import {Base, STATEMENTS} from "../Base.js";

export default class WhereBetween extends Base {

    /**
     * @param {String} column
     * @param {Array<number>} values
     * @param {String} condition
     * @param {String} [separator='AND']
     */
    constructor(column, values, condition = 'BETWEEN', separator = 'AND') {
        const query = `${column} ${condition} ? and ?`;
        const bindings = [values[0], values[1]];

        super(bindings, query, STATEMENTS.where, separator);
    }
}