import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class WhereBetweenColumns extends Base {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     * @param {String} [separator='AND']
     * @param {String} [condition='BETWEEN']
     */
    constructor(column, columns, separator = Separator.And, condition = Condition.Between) {
        const query = `${Utility.escapeColumnString(column)} ${condition} ${Utility.escapeColumnString(columns[0])} AND ${Utility.escapeColumnString(columns[1])}`;

        super([], query, separator);
    }
}