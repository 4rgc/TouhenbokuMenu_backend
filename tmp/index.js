const FetchQL = require('fetchql')
const { url, PASSED, NOT_PASSED } = require('./testing')
const { queryTests, SingleEntryQuery } = require('./querytesting')
const mysqlConnector = require('../src/lib/mysqlConnector')

class Tests {
    constructor() {
        this.singleEntryQueries = {
            'Meat': new SingleEntryQuery('Meat', { 'MeatId': 1 }, ['MeatId', 'MeatName'], 'Meats'),
            'Soup': new SingleEntryQuery('Soup', { 'SoupId': 1 }, ['SoupId', 'SoupName'], 'Soups'),
            'Noodle': new SingleEntryQuery('Noodle', { 'NoodleId': 1 }, ['NoodleId', 'NoodleName'], 'Noodles'),
            'Seasoning': new SingleEntryQuery('Seasoning', { 'SeasoningId': 1 }, ['SeasoningId', 'SeasoningName'], 'Seasonings'),
            'Topping': new SingleEntryQuery('Topping', { 'ToppingId': 1 }, ['ToppingId', 'ToppingName', 'ToppingPrice', 'ToppingExtra'], 'Toppings'
            )
        },
        this.testResults = {}
        this.run = async () => {
            const client = new FetchQL({ url })
            for(let queryName in this.singleEntryQueries)
                this.testResults[queryName] = { 
                        result: await queryTests.singleEntryQueryTest(
                            client, 
                            this.singleEntryQueries[queryName]
                            ),
                        failReason: this.singleEntryQueries[queryName].failReason
                    }
            //console.log('test result: \n')
            //console.log(await res)
        },
        this.printResults = async () => {
            let totalTestsCount = Object.keys(this.testResults).length
            let passedTestsCount = 0
            let failedTestsCount = 0
            let failedTests = {}
            console.log(this.testResults)
            for(let testName in this.testResults) {
                if(await this.testResults[testName].result == PASSED) {
                    passedTestsCount++
                }
                if(await this.testResults[testName].result == NOT_PASSED) {
                    failedTestsCount++
                    failedTests[testName] = this.testResults[testName]
                }
            }
            console.log('Tests passed: ' + passedTestsCount + '/' + totalTestsCount)
            console.log('Tests failed: ' + failedTestsCount + '/' + totalTestsCount)
            if(failedTestsCount > 0) {
                console.log('\nFailed tests details: ')
                for(let testName in failedTests) {
                    console.log(testName + ': ' + failedTests[testName].failReason)
                }
            }
            console.log()
        }
    }
}

tests = new Tests()
tests.run().then(
    () => {
        mysqlConnector.pool.end()
        tests.printResults()
    }
)