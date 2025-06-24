import "./Base.types.js";
import Builder from "./Builder.js";
import {STATEMENTS} from "./Base.js";

export default class Group extends Builder {
    /** @type {"AND"|"OR"} */
    #condition = "AND";

    /**
     * @param {"AND"|"OR"} [condition="AND"]
     */
    constructor(condition = "AND") {
        super(STATEMENTS.none);
        this.#condition = condition;
    }

    /**
     * @param {Boolean} withCondition
     * @return String
     */
    toString(withCondition) {
        let query = super.toString();

        if (query) {
            query = `(${query})`;
        }

        if (withCondition && query) {
            query = `${this.#condition} ${query}`;
        }

        return query;
    }

    /**
     * @param {Boolean} withCondition
     * @return PrepareObject
     */
    prepare(withCondition) {
        let prepareObject = super.prepare();

        if (prepareObject.query) {
            prepareObject.query = `(${prepareObject.query})`;
        }

        if (withCondition && prepareObject.query) {
            prepareObject.query = `${this.#condition} ${prepareObject.query}`;
        }

        return prepareObject;
    }
}