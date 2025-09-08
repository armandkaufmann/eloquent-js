import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";

export default class WhereRaw extends Base {

    /**
     * @param {String} expression
     * @param {Array<String|Number>|null} [bindings=null]
     * @param {String} [separator='AND']
     */
    constructor(expression, bindings = null, separator = Separator.And) {
        const bindingsArray = bindings ? bindings : [];

        super(bindingsArray, expression, separator);
    }
}