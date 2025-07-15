import WhereNull from "./WhereNull.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereNull extends WhereNull {

    /**
     * @param {string} column
     */
    constructor(column) {
        super(column, 'IS NULL', Separator.Or);
    }
}