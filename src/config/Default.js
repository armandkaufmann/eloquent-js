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
 * A number, or a string containing a number.
 * @typedef {Object} database
 * @property {string} file
 */

/**
 * A number, or a string containing a number.
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
        file: ':memory:'
    },
    table: {
        case: 'snake'
    }
}