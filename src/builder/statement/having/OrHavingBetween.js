import HavingBetween from "./HavingBetween.js";

export default class OrHavingBetween extends HavingBetween {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     */
    constructor(column, values) {
        super(column, values, 'OR');
    }
}