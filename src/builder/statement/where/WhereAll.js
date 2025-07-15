import WhereAny from "./WhereAny.js";
import Separator from "../../../enums/Separator.js";

export default class WhereAll extends WhereAny {

    /**
     * @param {Array<String>} columns
     * @param {String} operator
     * @param {String|number} value
     * @param {String} [separator='AND']
     */
    constructor(columns, operator, value, separator = Separator.And) {
        super(columns, operator, value, 'AND', separator);
    }
}