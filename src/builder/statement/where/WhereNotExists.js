import Separator from "../../../enums/Separator.js";
import WhereExists from "./WhereExists.js";
import Condition from "../../../enums/Condition.js";

export default class WhereNotExists extends WhereExists {

    /**
     * @param {Query} query
     * @param {String} [separator='AND']
     */
    constructor(query, separator = Separator.And) {
        super(query, separator, Condition.NotExists);
    }
}