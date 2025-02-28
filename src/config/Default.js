/**
 * @typedef {"snake" | "train" | "path" | "kebab" | "dot" | "constant" | "pascalSnake" | "pascal" | "camel"} TableCaseKey
 */

/**
 * @typedef {"snakeCase" | "trainCase"| "pathCase" | "kebabCase" | "dotCase" | "constantCase" | "pascalSnakeCase" | "pascalCase" | "camelCase"} TableCaseValue
 */

/**
 * Enum for table case types.
 * @readonly
 * @type {Record<TableCaseKey, TableCaseValue>}
 */
export const tableCases = {
    snake: "snakeCase",
    train: "trainCase",
    path: "pathCase",
    kebab: "kebabCase",
    dot: "dotCase",
    constant: "constantCase",
    pascalSnake: "pascalSnakeCase",
    pascal: "pascalCase",
    camel: "camelCase",
}

/**
 * Database configuration settings
 * @typedef {Object} database
 * @property {string| ":memory:"} file
 * @property {boolean} relative - If the database file is relative to the project path. Set to true if the database file is within your project, set to false if not. Defaults to True.
 */

/**
 * Table configuration settings
 * @typedef {Object} table
 * @property {TableCaseKey} case
 */

/**
 * Eloquent JS config object
 * @typedef {Object} config
 * @property {database} database
 * @property {table} table
 */

/** @type config */
export const defaultConfig = {
    database: {
        file: ':memory:',
        relative: true
    },
    table: {
        case: 'snake'
    }
}