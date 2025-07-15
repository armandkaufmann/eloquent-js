import WhereNotNull from "./WhereNotNull.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereNotNull extends WhereNotNull {

    /**
     * @param {string} column
     */
    constructor(column) {
        super(column, Separator.Or);
    }
}