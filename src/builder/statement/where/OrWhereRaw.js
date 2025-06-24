import WhereRaw from "./WhereRaw.js";

export default class OrWhereRaw extends WhereRaw {

    /**
     * @param {String} expression
     * @param {Array<String|Number>|null} [bindings=null]
     */
    constructor(expression, bindings = null) {
        super(expression, bindings, 'OR');
    }
}