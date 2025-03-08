import {Utility} from "../../utils/Utility.js";

/**
 * @typedef {Object} PrepareObject
 * @property {string} query
 * @property {Array<String|Number>} bindings
 */

export const STATEMENTS = {
    where: 'WHERE'
}

export class Base {
    _bindings;
    _query;
    _statement;
    _condition;

    /**
     * @param {Array<String|Number>} bindings
     * @param {String} query
     * @param {String} statement
     * @param {'AND'|'OR'} [condition='AND']
     */
    constructor(bindings, query, statement, condition = 'AND') {
        this._bindings = bindings;
        this._query = query;
        this._statement = statement;
        this._condition = condition;
    }

    /**
     * @param {Boolean} [withCondition=false]
     * @returns String
     */
    toString(withCondition = false) {
        return (withCondition ? this._condition + ' ' : '') + this.#mergeBindings(this._query, this._bindings);
    }

    /**
     * @param {Boolean} [withCondition=false]
     * @returns PrepareObject
     */
    serialize(withCondition = false) {
        return {
            query: (withCondition ? this._condition + ' ' : '') + this._query,
            bindings: this._bindings,
        }
    }

    /**
     * @returns String
     */
    getStatement() {
        return this._statement;
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