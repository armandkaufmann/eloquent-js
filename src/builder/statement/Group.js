import "./Base.types.js";
import Builder from "./Builder.js";
import {STATEMENTS} from "./Base.js";

export default class Group extends Builder {
    constructor() {
        super(STATEMENTS.none);
    }

    toString() {
        let query = super.toString();

        if (query) {
            query = `(${query})`;
        }

        return query;
    }
}