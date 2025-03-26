import {InvalidBetweenValueArrayLength, InvalidComparisonOperatorError} from "../errors/QueryBuilder/Errors.js";

export default class Validation {
    /**
     * @param {string|null|number|Object|Array} operator
     * @throws InvalidComparisonOperatorError
     */
    static validateComparisonOperator(operator) {
        if (typeof operator !== 'string') {
            throw new InvalidComparisonOperatorError(operator);
        }

        const validOperators = ["==", "=", "!=", "<>", ">", "<", ">=", "<=", "!<", "!>", 'like'];

        if (validOperators.filter((valid) => valid === operator?.toLowerCase()).length === 0) {
            throw new InvalidComparisonOperatorError(operator);
        }
    }

    /**
     * @param {Array<string|number>|null|Object} array
     * @throws InvalidComparisonOperatorError
     */
    static validateBetweenArrayLength(array) {
        if (!array) {
            throw new InvalidBetweenValueArrayLength(0);
        }

        const arrayLength = array.length;
        if (!Array.isArray(array) || arrayLength !== 2) {
            throw new InvalidBetweenValueArrayLength(arrayLength)
        }
    }
}