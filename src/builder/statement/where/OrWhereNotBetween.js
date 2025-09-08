import WhereNotBetween from "./WhereNotBetween.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereNotBetween extends WhereNotBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     */
    constructor(column, values) {
        super(column, values, Separator.Or);
    }
}