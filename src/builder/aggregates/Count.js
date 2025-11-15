import {Utility} from "../../utils/Utility.js";


export const AGGREGATE_TABLE_ALIAS = "temp_table";
export const AGGREGATE_COLUMN_ALIAS = "aggregate";

export class Count {
    /** @type {?Query} */
    #baseQuery = null;
    /** @type {string} */
    #column = "*";

    /**
     * @param {Query} baseQuery
     * @param {String} [column="*"]
     */
    constructor(baseQuery, column = "*") {
        this.#baseQuery = baseQuery;
        this.#column = column;
    }

    /**
     * @return PrepareObject
     */
    prepare() {
        const baseQueryPrepare = this.#baseQuery.prepare();

        const columnString = this.#column[0] === "*"
            ? "*"
            : `${AGGREGATE_TABLE_ALIAS}.${Utility.escapeColumnString(this.#column)}`;

        const combinedQuery = `SELECT COUNT(${columnString}) AS ${AGGREGATE_COLUMN_ALIAS} FROM (${baseQueryPrepare.query}) AS ${AGGREGATE_TABLE_ALIAS}`;

        return {
            query: combinedQuery,
            bindings: baseQueryPrepare.bindings
        }
    }
}