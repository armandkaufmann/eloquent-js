import Having from "./Having.js";
import Separator from "../../../enums/Separator.js";

export default class OrHaving extends Having {

    /**
     * @param {String} column
     * @param {String} operator
     * @param {String|number} value
     */
    constructor(column, operator, value) {
        super(column, operator, value, Separator.Or);
    }
}