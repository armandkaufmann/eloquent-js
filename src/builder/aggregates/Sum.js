import {Utility} from "../../utils/Utility.js";
import {AGGREGATE_TABLE_ALIAS, BaseAggregate} from "./BaseAggregate.js";
import {MissingRequiredArgument} from "../../errors/QueryBuilder/Errors.js";

export class Sum extends BaseAggregate {
    /**
     * @param {Query} baseQuery
     * @param {String} column
     */
    constructor(baseQuery, column) {
        super(baseQuery, column, "SUM");
    }

    /**
     * @return PrepareObject
     */
    prepare() {
        return this._prepareObject(this.buildColumn());
    }
}