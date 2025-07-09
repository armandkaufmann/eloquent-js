import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class OrderBy extends Base {

    /**
     * @param {String} column
     * @param {"ASC"|"DESC"} [order="ASC"]
     * @returns Query
     */
    constructor(column, order = "ASC") {
        const separator = ',';
        const query = `${Utility.escapeColumnString(column)} ${order}`;

        super([], query, separator);
    }
}