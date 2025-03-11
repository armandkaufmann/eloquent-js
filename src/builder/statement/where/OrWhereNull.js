import WhereNull from "./WhereNull.js";

export default class OrWhereNull extends WhereNull {

    /**
     * @param {string} column
     */
    constructor(column) {
        super(column, 'IS NULL', 'OR');
    }
}