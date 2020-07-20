const mysqlWrapper = require('../../src/lib/mysqlWrapper')
const fakePoolConneciton = require('../../src/lib/fakePoolConnection')
const fakePool = require('../../src/lib/fakePool')
const assert = require('assert')

describe('mysqlWrapper', () => {
    beforeEach(() => {
        this.wrapper = new mysqlWrapper()
    })
    describe('#getTransactionConnection()', () => {
        it('should return a FakePoolConnection', () => {
            this.wrapper.transactionConnections.push(new fakePoolConneciton())
            assert.strictEqual(this.wrapper.getTransationConnection(0).constructor.name, 'FakePoolConnection')
        })
        it('should return undefined', () => {
            assert.strictEqual(this.wrapper.getTransationConnection(0), undefined)
        })
    })
    describe('#createQuery()', () => {
        it('should return "test"', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.createQuery({query: 'test', params: 'test'}).then((res) => {
                assert.strictEqual(res, 'test')
                done()
            },
            (err) => {
                throw new Error('rejected')
            })
        })
        it('should return "bruh"', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.createQuery({query: 'bruh', params: 'test'}).then((res) => {
                assert.strictEqual(res, 'bruh')
                done()
            },
            (err) => {
                throw new Error('rejected')
            })
        })
    })
})