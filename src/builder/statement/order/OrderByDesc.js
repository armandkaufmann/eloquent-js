import OrderBy from "./OrderBy.js";

export default class OrderByDesc extends OrderBy {

    /**
     * @param {String} column
     * @returns Query
     */
    constructor(column) {
        super(column, "DESC");
    }
}