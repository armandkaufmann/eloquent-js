import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class WhereColumn extends Base {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String} comparisonColumn
     * @param {String} [separator='AND']
     */
    constructor(column, operator, comparisonColumn, separator = Separator.And) {
        const query = `${Utility.escapeColumnString(column)} ${operator} ${Utility.escapeColumnString(comparisonColumn)}`;

        super([], query, separator);
    }
}