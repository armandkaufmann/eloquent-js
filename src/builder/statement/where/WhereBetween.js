import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class WhereBetween extends Base {

    /**
     * @param {String} column
     * @param {Array<number>} values
     * @param {String} condition
     * @param {String} [separator='AND']
     */
    constructor(column, values, condition = Condition.Between, separator = Separator.And) {
        const query = `${Utility.escapeColumnString(column)} ${condition} ? AND ?`;
        const bindings = [values[0], values[1]];

        super(bindings, query, separator);
    }
}