import WhereBetween from "./WhereBetween.js";
import Separator from "../../../enums/Separator.js";

export default class OrWhereBetween extends WhereBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     */
    constructor(column, values) {
        super(column, values, 'BETWEEN', Separator.Or);
    }
}