import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class Select extends Base {

    /**
     * @param {Array<String>} column
     * @returns Query
     */
    constructor(column) {
        const query = Utility.escapeColumnString(column);

        super([], query, Separator.Comma);
    }
}