import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class GroupBy extends Base {

    /**
     * @param {Array<String>} columns
     * @returns Query
     */
    constructor(columns) {
        const separator = ',';
        const query = columns.map(column => Utility.escapeColumnString(column)).join(`${separator} `);

        super([], query, separator);
    }
}