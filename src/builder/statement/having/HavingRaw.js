import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";

export default class HavingRaw extends Base {

    /**
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     * @param {String} [separator='AND']
     */
    constructor(expression, bindings = null, separator = Separator.And) {
        const bindingArray = bindings ? bindings : [];

        super(bindingArray, expression, separator);
    }
}