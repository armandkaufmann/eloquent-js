import WhereBetween from "./WhereBetween.js";

export default class OrWhereBetween extends WhereBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     */
    constructor(column, values) {
        super(column, values, 'BETWEEN', 'OR');
    }
}