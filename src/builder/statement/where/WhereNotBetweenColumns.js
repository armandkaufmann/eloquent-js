import {Base} from "../Base.js";
import WhereBetweenColumns from "./WhereBetweenColumns.js";

export default class WhereNotBetweenColumns extends WhereBetweenColumns {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     * @param {String} [separator='AND']
     */
    constructor(column, columns, separator = 'AND') {
        super(column, columns, separator, 'NOT BETWEEN');
    }
}