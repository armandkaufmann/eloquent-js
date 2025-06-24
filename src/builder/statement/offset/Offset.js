import {Base} from "../Base.js";

export default class Offset extends Base {

    /**
     * @param {number} value
     * @returns Query
     */
    constructor(value) {
        super([value], '?', null);
    }
}