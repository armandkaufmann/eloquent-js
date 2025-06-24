import {Base} from "../Base.js";

export default class GroupByRaw extends Base {

    /**
     * @param {string} expression
     * @returns Query
     */
    constructor(expression) {
        const separator = ',';

        super([], expression, separator);
    }
}