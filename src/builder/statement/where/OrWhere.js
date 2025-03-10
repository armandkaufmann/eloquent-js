import Where from "./Where.js";

export default class OrWhere extends Where {

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string|number} value
     */
    constructor(column, operator, value) {
        super(column, operator, value, 'OR');
    }
}