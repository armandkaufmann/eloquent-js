import {Base} from "../Base.js";
import {Utility} from "../../../utils/Utility.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class WhereIn extends Base {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [condition='IN']
     * @param {String} [separator='AND']
     */
    constructor(column, values, condition = Condition.In, separator = Separator.And) {
        let query = "";
        let bindings = [];

        values.forEach((value, index) => {
            bindings.push(value);

            if (index === 0) {
                query += '?';
            } else {
                query += ', ?';
            }
        });

        query = `${Utility.escapeColumnString(column)} ${condition} (${query})`;

        super(bindings, query, separator);
    }
}