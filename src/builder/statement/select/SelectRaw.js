import {Base} from "../Base.js";

export default class SelectRaw extends Base {

    /**
     * @param {String} expression
     * @param {Array<String>|null} [bindings=null]
     * @returns Query
     */
    constructor(expression, bindings = null) {
        const bindingArray = bindings ? bindings : [];

        super(bindingArray, expression, ',');
    }
}