const { mysqlWrapper } = require('../../src/lib/mysqlWrapper')
const { environmentConfig } = require('../../src/lib/mysqlConnectorConfig')
const assert = require('assert')
const mysql = require('mysql')


describe.skip('mysqlWrapper Integration !!INTERNET!!', () => {
    before(() => {
        this.config = environmentConfig
    })

    beforeEach(() => {
        this.wrapper = new mysqlWrapper()
        this.wrapper.connector.initializeInternalPool(this.config)
        //console.log(this.wrapper.connector.pool)
        this.onRejected = (err) => {
            throw new Error(err /*+ '\n' + err.stack*/)
        }
    })
    after((done) => {
        this.wrapper.connector.pool.end(err => {
            if(err)
                throw err
            done()
        })
    }) 
    describe('select test', () => {
        it('should return 1 line', (done) => {
            this.wrapper.createQuery({
                query: 'SELECT * FROM ?? WHERE ?? = ? LIMIT 1',
                params: ['Soups', 'SoupId', 1]
            }).then((res) => {
                assert.strictEqual(res.shift().SoupName, 'Pork')
                done()
            }).catch(this.onRejected)
        })
    })
    describe('multiple transactions', () => {
        it('should start transactions on different connections', (done) => {
            let t1done = false, t2done = false
            let doneCheck = () => {
                return t1done && t2done
            }
            this.wrapper.beginTransaction().then((index) => {
                return index
            }).then((index) => {
                this.wrapper.commit(index).then(() => {
                    t1done = true
                    if(doneCheck())
                    done()
                }, this.onRejected)
            }, 
            this.onRejected)
            this.wrapper.beginTransaction().then((index) => {
                return index
            }).then((index) => {
                this.wrapper.commit(index).then(() => {
                    t2done = true
                    if(doneCheck())
                    done()
                })
            },
            this.onRejected)
        })
    })
})