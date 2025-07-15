import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class GroupBy extends Base {

    /**
     * @param {Array<String>} columns
     * @returns Query
     */
    constructor(columns) {
        const separator = Separator.comma;
        const query = columns.map(column => Utility.escapeColumnString(column)).join(`${separator} `);

        super([], query, separator);
    }
}