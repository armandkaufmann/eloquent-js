import WhereBetween from "./WhereBetween.js";
import Separator from "../../../enums/Separator.js";

export default class WhereNotBetween extends WhereBetween {

    /**
     * @param {String} column
     * @param {Array<number>} values
     * @param {String} [separator='AND']
     */
    constructor(column, values, separator = Separator.And) {
        super(column, values, 'NOT BETWEEN', separator);
    }
}