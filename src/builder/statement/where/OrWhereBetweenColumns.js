import WhereBetweenColumns from "./WhereBetweenColumns.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereBetweenColumns extends WhereBetweenColumns {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     */
    constructor(column, columns) {
        super(column, columns, Separator.Or);
    }
}