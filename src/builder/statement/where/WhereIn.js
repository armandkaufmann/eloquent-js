import {Base, STATEMENTS} from "../Base.js";

export default class WhereIn extends Base {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [condition='IN']
     * @param {String} [separator='AND']
     */
    constructor(column, values, condition = 'IN', separator = 'AND') {
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

        query = `${column} ${condition} (${query})`;

        super(bindings, query, STATEMENTS.where, separator);
    }
}