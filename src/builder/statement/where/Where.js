import {Base, STATEMENTS} from "../Base.js";

export default class Where extends Base {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [separator='AND']
     */
    constructor(column, operator, value, separator = 'AND') {
        const query = `${column} ${operator} ?`;
        const bindings = [value];

        super(bindings, query, separator);
    }
}