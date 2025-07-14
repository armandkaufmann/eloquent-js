import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";

export default class InnerJoin extends Base {

    /**
     * @param {String} table
     * @param {String} localKey
     * @param {String} operator
     * @param {String|number} foreignKey
     * @param {String} [join="INNER JOIN"]
     */
    constructor(table, localKey, operator, foreignKey, join = "INNER JOIN") {
        const query = `${join} ${Utility.escapeColumnString(table)} ON ${Utility.escapeColumnString(localKey)} ${operator} ${Utility.escapeColumnString(foreignKey)}`;

        super([], query, null);
    }
}