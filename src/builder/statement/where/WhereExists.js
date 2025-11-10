import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";
import Condition from "../../../enums/Condition.js";

export default class WhereExists extends Base {

    /**
     * @param {Query} query
     * @param {String} [separator='AND']
     * @param {String|Condition} [condition='EXISTS']
     */
    constructor(query, separator = Separator.And, condition = Condition.Exists) {
        const prepareObject = query.prepare();
        const queryString = `${condition} (${prepareObject.query})`;

        super(prepareObject.bindings, queryString, separator);
    }
}