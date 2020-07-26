const dao = require('../../src/lib/dao')
const { mysqlWrapper ,mysqlWrapperInstance } = require('../../src/lib/mysqlWrapper')
const fakePool = require('../../src/lib/fakePool')
const assert = require('assert')
const sqlConstants = require('../../src/util/sqlConstants')

describe('DAO', () => {
    before(() => {
        this.onRejected = (err) => {
            throw new Error(err)
        }
    })
    beforeEach(() => {
        dao.mysqlWrapper = new mysqlWrapper()
        dao.mysqlWrapper.internalConnector.internalPool = new fakePool()
    })
    describe('#mysqlWrapper', () => {
        beforeEach(() => {
            dao.mysqlWrapper = mysqlWrapperInstance
        })
        it('should return environment-initialized mysqlWrapper', () => {
            assert.deepStrictEqual(dao.mysqlWrapper, mysqlWrapperInstance)
        })
        it('should return empty initialized mysqlWrapper', () => {
            dao.mysqlWrapper = new mysqlWrapper()
            assert.deepStrictEqual(dao.mysqlWrapper, new mysqlWrapper())
        })
    })

    describe('#find()', () => {
        it('should return the query text', (done) => {
            dao.find(0).then((res) => {
                assert.strictEqual(res, 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1;')
                done()
            }).catch(this.onRejected)
        })
    })

    describe('#findAll()', () => {
        it('should return the query text in an array', (done) => {
            dao.findAll().then(res => {
                assert.deepStrictEqual(res, ['SELECT * FROM ??;'])
                done()
            }).catch(this.onRejected)
        })
    })

    describe('#findByFields()', () => {
        it('should return query text in an array', (done) => {
            dao.findByFields({
                fields: {
                    id: 'bruh'
                }
            }).then(res => {
                assert.deepStrictEqual(res, ['SELECT * FROM ?? WHERE id = ?'])
                done()
            }).catch(this.onRejected)
        })
        it('should return query text in an array', done => {
            dao.findByFields({
                fields: {
                    id: 'bruh'
                },
                limit: 10
            }).then(res => {
                assert.deepStrictEqual(res, ['SELECT * FROM ?? WHERE id = ? LIMIT ?'])
                done()
            }).catch(this.onRejected)
        })
        it('should return query text in an array', done => {
            dao.findByFields({
                fields: {
                    id: 'bruh'
                },
                limit: 10,
                order: {
                    by: 'bruh',
                    direction: sqlConstants.ASC
                }
            }).then(res => {
                assert.deepStrictEqual(res, ['SELECT * FROM ?? WHERE id = ? ORDER BY ?? ASC LIMIT ?'])
                done()
            }).catch(this.onRejected)
        })
    })

    describe('#update()', () => {
        it('should return query text in an array', done => {
            dao.update(null, {}).then(
                res => {
                assert.deepStrictEqual(res, ['UPDATE ??\nSET ?\nWHERE ?? = ?;'])
                done()
            }).catch(this.onRejected)
        })
    })
    
    describe('#insert()', () => {
        it('should return query text in an array', done => {
            dao.TABLE_NAME = 'bruh'
            dao.insert(null, {}).then(
                res => {
                assert.deepStrictEqual(res, ['INSERT INTO bruh\nSET ?;'])
                done()
            }).catch(this.onRejected)
        })
    })

    describe('#delete()', () => {
        it('should return query text in an array', done => {
            dao.delete(null, {}).then(
                res => {
                assert.deepStrictEqual(res, ['DELETE FROM  ??\nWHERE ?? = ?;'])
                done()
            }).catch(this.onRejected)
        })
    })
})