/**
 * @typedef {Object} Condition
 * @property {'BETWEEN'} Between
 * @property {'NOT BETWEEN'} NotBetween
 * @property {'AND'} And
 * @property {'OR'} Or
 * @property {'IS NULL'} Null
 * @property {'IS NOT NULL'} NotNull
 * @property {'IN'} In
 * @property {'NOT IN'} NotIn
 */

/** @type Condition **/
const Condition = {
    Between: 'BETWEEN',
    NotBetween: 'NOT BETWEEN',
    And: 'AND',
    Or: 'OR',
    Null: 'IS NULL',
    NotNull: 'IS NOT NULL',
    In: 'IN',
    NotIn: 'NOT IN'
}

export default Condition;