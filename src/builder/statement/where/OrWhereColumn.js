import WhereColumn from "./WhereColumn.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereColumn extends WhereColumn {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String} comparisonColumn
     */
    constructor(column, operator, comparisonColumn) {
        super(column, operator, comparisonColumn, Separator.Or);
    }
}