import {Base} from "../Base.js";

export default class From extends Base {

    /**
     * @param {String} table
     * @param {String|null} [as=null]
     * @returns Query
     */
    constructor(table, as = null) {
        let query = table;

        if (as) {
            query += ` AS ${as}`;
        }

        super([], query, null);
    }
}