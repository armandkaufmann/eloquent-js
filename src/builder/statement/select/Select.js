import {Base, STATEMENTS} from "../Base.js";

export default class Select extends Base {

    /**
     * @param {Array<String>} columns
     * @returns Query
     */
    constructor(columns) {
        const separator = ', ';
        const query = columns.join(separator);

        super([], query, separator);
    }

    /**
     * @param {Boolean} [withSeparator=false]
     * @returns String
     */
    toString(withSeparator = false) {
        return super.toString(false);
    }

    /**
     * @param {Boolean} [withSeparator=false]
     * @returns PrepareObject
     */
    prepare(withSeparator = false) {
        return super.prepare(false);
    }
}