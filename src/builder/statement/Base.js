export default class Base {
    _bindings;
    _query;
    _and = true;

    constructor() {
        if (this.constructor === Base) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * @returns String
     */
    toString() {
        throw new Error("Method 'toString()' must be implemented.");
    }

    prepare() {
        throw new Error("Method 'toString()' must be implemented.");
    }
}