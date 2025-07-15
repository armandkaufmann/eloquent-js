import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";

export default class GroupByRaw extends Base {

    /**
     * @param {string} expression
     * @returns Query
     */
    constructor(expression) {
        super([], expression, Separator.Comma);
    }
}