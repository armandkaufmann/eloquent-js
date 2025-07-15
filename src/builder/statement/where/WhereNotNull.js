import WhereNull from "./WhereNull.js";
import Separator from "../../../enums/Separator.js";

export default class WhereNotNull extends WhereNull {

    /**
     * @param {String} column
     * @param {String} [separator='AND']
     */
    constructor(column, separator = Separator.And) {
        super(column, 'IS NOT NULL', separator);
    }
}