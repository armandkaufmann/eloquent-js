export class DatabaseNotFoundError extends Error {
    /**
     * @param {string|null} [provider='Default']
     * @param {string|null} [filepath='None']
     * */
    constructor(provider = 'Default', filepath='undefined') {
        let message = `\nSQLite database not found in path: "${filepath}" from ${provider}.`
        message += `\nPlease ensure that your SQLite database file exists before executing queries.`;

        super(message);
        this.name = "DatabaseNotFoundError";
    }
}