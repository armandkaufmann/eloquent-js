import {Base, STATEMENTS} from "../Base.js";

export default class Where extends Base {
    constructor(column, operator, value, condition = 'AND') {
        const query = `${column} ${operator} ?`;
        const bindings = [value];

        super(bindings, query, STATEMENTS.where, condition);
    }
}