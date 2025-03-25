import {Base, STATEMENTS} from "../Base.js";

export default class InnerJoin extends Base {

    /**
     * @param {String} table
     * @param {String} localKey
     * @param {String} operator
     * @param {String|number} foreignKey
     * @param {String} [separator="INNER JOIN"]
     */
    constructor(table, localKey, operator, foreignKey, separator = STATEMENTS.innerJoin) {
        const query = `${separator} ${table} ON ${localKey} ${operator} ${foreignKey}`;

        super([], query, null);
    }
}