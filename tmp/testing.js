
module.exports = 
{
    url: "http://localhost:8080/graphql",

    /**
     * Equality assertion.
     * @returns {boolean}
     */
    assertEqual: (value1, value2) => {
        return value1 == value2
    },

    /**
     * Inequality assertion.
     * @returns {boolean}
     */
    assertNotEqual: (value1, value2) => {
        return value1 != value2
    },

    /**
     * Strict equality / identity assertion.
     * @returns {boolean}
     */
    assertIdentical: (value1, value2) => {
        return value1 === value2
    },

    /**
     * Strict inequality / non-identity assertion.
     * @returns {boolean}
     */
    assertNonIdentical: (value1, value2) => {
        return value1 !== value2
    },
    PASSED: true,
    NOT_PASSED: false
}