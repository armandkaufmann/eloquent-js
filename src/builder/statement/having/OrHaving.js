import Having from "./Having.js";

export default class OrHaving extends Having {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String|number} value
     */
    constructor(column, operator, value) {
        super(column, operator, value, 'OR');
    }
}