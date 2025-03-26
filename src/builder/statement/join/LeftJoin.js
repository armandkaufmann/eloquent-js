import InnerJoin from "./InnerJoin.js";

export default class LeftJoin extends InnerJoin {

    /**
     * @param {String} table
     * @param {String} localKey
     * @param {String} operator
     * @param {String|number} foreignKey
     */
    constructor(table, localKey, operator, foreignKey) {
        super(table, localKey, operator, foreignKey, "LEFT JOIN");
    }
}