import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class Where extends Base {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [separator='AND']
     */
    constructor(column, operator, value, separator = 'AND') {
        const query = `${Utility.escapeColumnString(column)} ${operator} ?`;
        const bindings = [value];

        super(bindings, query, separator);
    }
}