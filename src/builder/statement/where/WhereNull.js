import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class WhereNull extends Base {

    /**
     * @param {String} column
     * @param {String} [condition='IS NULL']
     * @param {String} [separator='AND']
     */
    constructor(column, condition = 'IS NULL', separator = Separator.And) {
        const query = `${Utility.escapeColumnString(column)} ${condition}`;

        super([], query, separator);
    }
}