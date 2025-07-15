import WhereNull from "./WhereNull.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class OrWhereNull extends WhereNull {

    /**
     * @param {string} column
     */
    constructor(column) {
        super(column, Condition.Null, Separator.Or);
    }
}