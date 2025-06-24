import {InvalidComparisonOperatorError} from "../errors/QueryBuilder/Errors.js";

export class Utility {

    /**
     * @param {Array<String|Number>} values
     * @returns String
     */
    static valuesToString(values) {
        let result = "";

        values.forEach((value, idx) => {
            result += Utility.valueToString(value);

            if (idx < values.length - 1) {
                result += ", ";
            }
        });

        return result;
    }

    /**
     * @param {string} value
     * @returns String
     */
    static valueToString(value) {
        if (typeof value === 'string') {
            return "'" + value + "'";
        } else {
            return value;
        }
    }
}