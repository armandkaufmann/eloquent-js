import {STATEMENTS} from "./Base.js";
import Select from "./select/Select.js";

export default class Builder {
    /** @type {Array<Base|Group>} */
    #statements = [];
    /** @type {Statement} */
    #type;
    /** @type {Boolean} */
    #withStatement;

    /**
     * @param {Statement} type
     */
    constructor(type) {
        this.#type = type;
        this.#parseType();
        this.#prepareBuilder();
    }

    /**
     * @param {Base} statement
     * @return Builder
     */
    push(statement) {
        this.#statements.push(statement);

        return this;
    }

    /**
     * @param {Base} statement
     * @return Builder
     */
    pushOrUpdate(statement) {
        this.#statements = [statement];

        return this;
    }


    /**
     * @param {Boolean} [withCondition=true]
     * @return String
     */
    toString(withCondition = true) {
        let result = this.#statements
            .filter((statement) => statement.toString(false))
            .map((statement, index) => statement.toString(index !== 0))
            .join(" ");

        if (result && this.#withStatement) {
            result = `${this.#type} ${result}`;
        }

        return result;
    }

    /**
     * @param {Boolean} [withCondition=true]
     * @return PrepareObject
     */
    prepare(withCondition = true) {
        /** @type {PrepareObject} */
        let result = this.#statements
            .reduce((result, statement, index) => {
                const prepare = statement.prepare(index !== 0);

                result.query += `${index > 0 ? ' ' : ''}${prepare.query}`;
                result.bindings.push(...prepare.bindings);

                return result;
            }, {
                query: "",
                bindings: []
            });

        if (result.query && this.#withStatement) {
            result.query = `${this.#type} ${result.query}`;
        }

        return result;
    }

    #parseType() {
        switch (this.#type) {
            case STATEMENTS.join:
            case STATEMENTS.none:
                this.#withStatement = false;
                break;
            default:
                this.#withStatement = true;
        }
    }

    #prepareBuilder() {
        switch (this.#type) {
            case STATEMENTS.select:
                this.#statements.push(new Select(['*']));
                break;
            default:
                break;
        }
    }
}