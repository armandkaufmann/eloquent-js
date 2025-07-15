import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";

export default class SelectRaw extends Base {

    /**
     * @param {String} expression
     * @param {Array<String|Number>|null} [bindings=null]
     * @returns Query
     */
    constructor(expression, bindings = null) {
        const bindingArray = bindings ? bindings : [];

        super(bindingArray, expression, Separator.comma);
    }
}