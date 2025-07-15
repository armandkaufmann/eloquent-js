import WhereIn from "./WhereIn.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereIn extends WhereIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     */
    constructor(column, values) {
        super(column, values, 'IN', Separator.Or);
    }
}