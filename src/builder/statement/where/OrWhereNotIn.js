import WhereNotIn from "./WhereNotIn.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereNotIn extends WhereNotIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     */
    constructor(column, values) {
        super(column, values, Separator.Or);
    }
}