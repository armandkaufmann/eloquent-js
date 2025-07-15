import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class Select extends Base {

    /**
     * @param {Array<String>} column
     * @returns Query
     */
    constructor(column) {
        const separator = ',';
        const query = Utility.escapeColumnString(column);

        super([], query, separator);
    }
}