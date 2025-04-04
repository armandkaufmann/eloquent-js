import {Base} from "../Base.js";

export default class GroupBy extends Base {

    /**
     * @param {Array<String>} columns
     * @returns Query
     */
    constructor(columns) {
        const separator = ',';
        const query = columns.join(`${separator} `);

        super([], query, separator);
    }
}