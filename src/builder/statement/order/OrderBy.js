import {Base} from "../Base.js";

export default class OrderBy extends Base {

    /**
     * @param {String} column
     * @param {"ASC"|"DESC"} [order="ASC"]
     * @returns Query
     */
    constructor(column, order = "ASC") {
        const separator = ',';
        const query = `${column} ${order}`;

        super([], query, separator);
    }
}