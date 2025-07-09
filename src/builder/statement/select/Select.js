import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class Select extends Base {

    /**
     * @param {Array<String>} columns
     * @returns Query
     */
    constructor(columns) {
        columns = Utility.escapeColumnStrings(columns);

        const separator = ',';
        const query = columns.join(`${separator} `);

        super([], query, separator);
    }
}