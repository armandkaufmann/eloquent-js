import {Utility} from "../../utils/Utility.js";
import "./Base.Types.js"

/**
 * @enum {Statement}
 */
export const STATEMENTS = {
    where: 'WHERE'
}

export class Base {
    _bindings;
    _query;
    _statement;
    _separator;

    /**
     * @param {Array<String|Number>} bindings
     * @param {String} query
     * @param {Statement} statement
     * @param {String} separator
     */
    constructor(bindings, query, statement, separator) {
        this._bindings = bindings;
        this._query = query;
        this._statement = statement;
        this._separator = separator;
    }

    /**
     * @param {Boolean} [withSeparator=false]
     * @returns String
     */
    toString(withSeparator = false) {
        let result = this.#mergeBindings(this._query, this._bindings);

        if (withSeparator) {
            result = `${this._separator} ${result}`;
        }

        return result;
    }

    /**
     * @param {Boolean} [withSeparator=false]
     * @returns PrepareObject
     */
    serialize(withSeparator = false) {
        let result = {
            query: this._query,
            bindings: this._bindings
        }

        if (withSeparator) {
            result.query = `${this._separator} ${result.query}`;
        }

        return result;
    }

    /**
     * @param {string} query
     * @param {Array<String|Number>} bindings
     * @param {String|'?'} [replacer='?']
     * @returns String
     */
    #mergeBindings(query, bindings, replacer = '?') {
        let result = ``;
        let bindingsIndex = 0;

        for (let i = 0; i < query.length; i++) {
            if (query[i] === replacer) {
                result += Utility.valueToString(bindings[bindingsIndex]);
                bindingsIndex++;
            } else {
                result += query[i];
            }
        }

        return result;
    }
}