import {Base} from "../Base.js";
import Separator from "../../../enums/Separator.js";
import WhereExists from "./WhereExists.js";

export default class OrWhereExists extends WhereExists {

    /**
     * @param {Query} query
     */
    constructor(query) {
        super(query, Separator.Or);
    }
}