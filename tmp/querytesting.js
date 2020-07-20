const { url, assertEqual, assertNotEqual, getTypeObject, PASSED, NOT_PASSED } = require('./testing.js')
const FetchQL = require('fetchql')
global.fetch = require('node-fetch')
const QueryMaker = require('graphql-query-builder')
const DAO = require('../src/lib/dao')
const mysqlConnector = require('../src/lib/mysqlConnector')

module.exports.queryTests = 
{

    /**
     * Tests if connection over the given FetchQL instance is working.
     * @param {Object} client - A FetchQL instance initialized with a URL
     * @returns {boolean} 
     */
    connectionTest: (client) => {
        client.query({ query: "{test}" })
            .then(null, error => {
                return NOT_PASSED;
            })
    },

    /**
     * Tests if a single entry query for specified table works.
     * @param {FetchQL} client - A FetchQL instance initialized with working URL to the server
     * @param {SingleEntryQuery} query - Query parameters
     * @returns {Promise<any>}
     */
    singleEntryQueryTest: async (client, query) => {
        // Make the query
        madeQuery = new QueryMaker(query.name, query.args)
            .find(query.resultFields)
        finalQuery = '{' + madeQuery.toString() + '}'     
        
        // Query the GraphQL server
        queryResult = await sendGqlQuery(finalQuery)
        
        // Query the MySQL database
        DAO.TABLE_NAME = query.actualTable
        actualResult = await DAO.findByFields({ fields: query.args })
            .catch(error => {
                console.error('Querying MySQL server resulted in an error: ' 
                              + JSON.stringify(error))
            })

        // Retrieve the first and the only one result (single entry)
        actualResult = actualResult.shift()

        // Check if both results are empty
        if(!queryResult && !actualResult)
            return PASSED
        
        try {
            for(let key in queryResult.data[query.name]) {
                let gqlData = queryResult.data[query.name][key]
                let sqlData = actualResult[key]
                if(!assertEqual(gqlData, sqlData)) {
                    query.failReason = 
                        `Assertion failed: ${gqlData} != ${sqlData}`
                    return NOT_PASSED
                }
            }
        }
        catch(e) {
            console.error(e.message)
            
            query.failReason = 'Error: ' + e.message
            return NOT_PASSED
        }
        return PASSED
    },

    /**
     * Tests if all entry query for specified table works.
     * @param {Object} client - A FetchQL instance initialized with working URL to the server
     * @param {String} objectName - Name of the table to be tested (case-insensitive)
     * @returns {boolean}
     */
    tableAllEntryQueryTest: async (client, objectName) => {
        // Retrieve the type definition of the table to be tested
        tableType = getTypeObject(objectName)

        // Make the query
        query = new Query(objectType.allEntriesQuery)
            .find(objectType.columns)
        queryString = '{' + query.toString() + '}'

        return await client.query({ url, query: queryString })
            .then(result => {
                // Fail if null is returned
                return assertNotEqual(result, null)
            },
            error => {
                console.error(error)
                return NOT_PASSED
            })
    },
    /**
     * 
     */
    sendGqlQuery: (query) => {
        return client.query({ url, query: query })
        .catch(error => {
            console.error('Querying GraphQL resulted in an error: ' 
                          + JSON.stringify(error))
        })
    }
}

class SingleEntryQuery {
    /**
     * Constructs the query
     * @param {String} name - Name of the Query 
     * @param {{}} args - Arguments that will be passed to the query
     * @param {Array<String>} resultFields - Fields that will be returned by the query
     * @param {String} actualTable - Db table that the returned data will be checked with
     */
    constructor(name, args, resultFields, actualTable) {
        this.name = name
        this.args = args
        this.resultFields = resultFields
        this.actualTable = actualTable
    }
}

module.exports.SingleEntryQuery = SingleEntryQuery