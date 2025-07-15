import HavingRaw from "./HavingRaw.js";
import Separator from "../../../enums/Separator.js";

export default class OrHavingRaw extends HavingRaw {

    /**
     * @param {String} expression
     * @param {Array<String|number>|null} [bindings=null]
     */
    constructor(expression, bindings = null) {
        super(expression, bindings, Separator.Or);
    }
}