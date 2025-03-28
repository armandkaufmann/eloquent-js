import {Base} from "../Base.js";

export default class Select extends Base {

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