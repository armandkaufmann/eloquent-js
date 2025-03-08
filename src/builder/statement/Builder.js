export default class Builder {
    /** @type {Array<Base>} */
    #statements = [];

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
        return this.#statements
            .map((statement, index) =>  this.#finalizeString(statement.toString(index !== 0), index, statement.getStatement()))
            .join(" ");
    }

    /**
     * @return PrepareObject
     */
    prepare() {
        return this.#statements
            .reduce((result, statement, index) => {
                const prepare = statement.serialize(index !== 0);

                result.query += this.#finalizeString(prepare.query, index, statement.getStatement());
                result.bindings.push(...prepare.bindings);

                return result;
            }, {
                query: "",
                bindings: []
            })
    }

    /**
     * @param {String} query
     * @param {String} statement
     * @param {Number} index
     * @return String
     */
    #finalizeString(query, index, statement) {
        return `${index === 0 ? `${statement} ` : ''}${query}`
    }
}