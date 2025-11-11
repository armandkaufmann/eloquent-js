import Separator from "../../../enums/Separator.js";
import WhereNotExists from "./WhereNotExists.js";

export default class OrWhereNotExists extends WhereNotExists {

    /**
     * @param {Query} query
     */
    constructor(query) {
        super(query, Separator.Or);
    }
}