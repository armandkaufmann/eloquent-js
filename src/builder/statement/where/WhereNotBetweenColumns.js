import {Base} from "../Base.js";
import WhereBetweenColumns from "./WhereBetweenColumns.js";
import Separator from "../../../enums/Separator.js";

export default class WhereNotBetweenColumns extends WhereBetweenColumns {

    /**
     * @param {String} column
     * @param {Array<String>} columns
     * @param {String} [separator='AND']
     */
    constructor(column, columns, separator = Separator.And) {
        super(column, columns, separator, 'NOT BETWEEN');
    }
}