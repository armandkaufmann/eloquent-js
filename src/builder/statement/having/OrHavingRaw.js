import HavingRaw from "./HavingRaw.js";

export default class OrHavingRaw extends HavingRaw {

    /**
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     */
    constructor(expression, bindings = null) {
        super(expression, bindings, 'OR');
    }
}