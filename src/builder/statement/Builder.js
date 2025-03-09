export default class Builder {
    /** @type {Array<Base>} */
    #statements = [];
    /** @type {Statement} */
    #type;

    /**
     * @param {Statement} type
     */
    constructor(type) {
        this.#type = type;
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
     * @return String
     */
    toString() {
        let result = this.#statements
            .map((statement, index) => statement.toString(index !== 0))
            .join(" ");

        if (result) {
            result = `${this.#type} ${result}`;
        }

        return result;
    }

    /**
     * @return PrepareObject
     */
    prepare() {
        /** @type {PrepareObject} */
        let result = this.#statements
            .reduce((result, statement, index) => {
                const prepare = statement.serialize(index !== 0);

                result.query += `${index > 0 ? ' ' : ''}${prepare.query}`;
                result.bindings.push(...prepare.bindings);

                return result;
            }, {
                query: "",
                bindings: []
            });

        if (result.query) {
            result.query = `${this.#type} ${result.query}`;
        }

        return result;
    }
}