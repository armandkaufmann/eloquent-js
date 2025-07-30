import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";

export default class GroupBy extends Base {

    /**
     * @param {string} column
     * @returns Query
     */
    constructor(column) {
        super([], Utility.escapeColumnString(column), Separator.Comma);
    }
}