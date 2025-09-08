import WhereIn from "./WhereIn.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class OrWhereIn extends WhereIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     */
    constructor(column, values) {
        super(column, values, Condition.In, Separator.Or);
    }
}