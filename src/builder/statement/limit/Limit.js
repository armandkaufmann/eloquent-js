import {Base} from "../Base.js";

export default class Limit extends Base {

    /**
     * @param {number} value
     * @returns Query
     */
    constructor(value) {
        super([value], '?', null);
    }
}