import {Base} from "../Base.js";

export default class OrderByDesc extends Base {

    /**
     * @param {String} column
     * @returns Query
     */
    constructor(column) {
        const separator = ',';
        const query = `${column} DESC`;

        super([], query, separator);
    }
}