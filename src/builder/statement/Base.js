import {Utility} from "../../utils/Utility.js";

/**
 * @typedef {Object} PrepareObject
 * @property {string} query
 * @property {Array<String|Number>} bindings
 * @property {'AND'|'OR'} condition
 */

export default class Base {
    _bindings;
    _query;
    _condition;

    /**
     * @param {Array<String|Number>} bindings
     * @param {String} query
     * @param {'AND'|'OR'} [condition='AND']
     */
    constructor(bindings, query, condition = 'AND') {
        this._bindings = bindings;
        this._query = query;
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
     * @returns PrepareObject
     */
    serialize() {
        return {
            query: this._query,
            bindings: this._bindings,
            condition: this._condition,
        }
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