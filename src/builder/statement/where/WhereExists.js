import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";

export default class WhereExists extends Base {

    /**
     * @param {Query} query
     * @param {String} [separator='AND']
     */
    constructor(query, separator = Separator.And) {
        const prepareObject = query.prepare();
        const queryString = `EXISTS (${prepareObject.query})`;

        super(prepareObject.bindings, queryString, separator);
    }
}