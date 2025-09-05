import WhereIn from "./WhereIn.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class WhereNotIn extends WhereIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = Separator.And) {
        super(column, values, Condition.NotIn, separator);
    }
}