import {Base} from "../Base.js";

export default class CrossJoin extends Base {

    /**
     * @param {String} table
     */
    constructor(table) {
        const query = `CROSS JOIN ${table}`;

        super([], query, null);
    }
}