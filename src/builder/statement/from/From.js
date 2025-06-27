import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class From extends Base {

    /**
     * @param {String} table
     * @param {String|null} [as=null]
     * @returns Query
     */
    constructor(table, as = null) {
        let query = Utility.escapeString(table);

        if (as) {
            query += ` AS ${Utility.escapeString(as)}`;
        }

        super([], query, null);
    }
}