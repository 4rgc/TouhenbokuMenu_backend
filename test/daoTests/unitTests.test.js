const dao = require('../../src/lib/dao')
const { mysqlWrapper ,mysqlWrapperInstance } = require('../../src/lib/mysqlWrapper')
const assert = require('assert')

describe('DAO', () => {
    describe('mysqlWrapper', () => {
        it('should return environment-initialized mysqlWrapper', () => {
            assert.deepStrictEqual(dao.mysqlWrapper, mysqlWrapperInstance)
        })
        it('should return empty initialized mysqlWrapper', () => {
            dao.mysqlWrapper = new mysqlWrapper()
            assert.deepStrictEqual(dao.mysqlWrapper, new mysqlWrapper())
        })
    })
    //describe('PRIMARY_KEY')
})