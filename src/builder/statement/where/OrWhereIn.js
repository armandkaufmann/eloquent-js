import WhereIn from "./WhereIn.js";

export default class OrWhereIn extends WhereIn {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     */
    constructor(column, values) {
        super(column, values, 'OR');
    }
}