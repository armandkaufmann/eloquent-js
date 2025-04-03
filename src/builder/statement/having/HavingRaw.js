import {Base} from "../Base.js";

export default class HavingRaw extends Base {

    /**
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     * @param {String} [separator='AND']
     */
    constructor(expression, bindings = null, separator = 'AND') {
        const bindingArray = bindings ? bindings : [];

        super(bindingArray, expression, separator);
    }
}