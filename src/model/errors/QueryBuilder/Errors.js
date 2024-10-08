export class TableNotSetError extends Error {
    /**
     * @param {string|null} [provider='Default']
     * */
    constructor(provider = 'Default') {
        let message = `\nAttempting to generate/execute a query without having set the table on ${provider}.`
        message += `\nPlease ensure that you are setting the table property of the QueryBuilder Class.`;

        super(message);
        this.name = "TableNotSetError";
    }
}