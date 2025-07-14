import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class CrossJoin extends Base {

    /**
     * @param {String} table
     */
    constructor(table) {
        const query = `CROSS JOIN ${Utility.escapeColumnString(table)}`;

        super([], query, null);
    }
}