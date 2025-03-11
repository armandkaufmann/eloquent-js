import {Base, STATEMENTS} from "../Base.js";

export default class WhereIn extends Base {

    /**
     * @param {String} column
     * @param {Array<String|Number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = 'AND') {
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

        query = `${column} IN (${query})`;

        super(bindings, query, STATEMENTS.where, separator);
    }
}