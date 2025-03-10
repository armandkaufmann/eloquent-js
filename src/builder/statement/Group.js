import "./Base.types.js";

export default class Group {
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

    toString() {
        let result = this.#statements
            .map((statement, index) => statement.toString(index !== 0))
            .join(" ");

        if (result) {
            result = `(${result})`;
        }

        return result;
    }
}