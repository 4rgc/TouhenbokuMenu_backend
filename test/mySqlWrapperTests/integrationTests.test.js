const { mysqlWrapper } = require('../../src/lib/mysqlWrapper')
const { mysqlConnectorConfig } = require('../../src/lib/mysqlConnectorConfig')
const mysql = require('mysql')
const assert = require('assert')


describe('mysqlWrapper Integration !!INTERNET!!', () => {
    before(() => {
        this.config = new mysqlConnectorConfig()
        this.config.hostAddress = 'sql3.freemysqlhosting.net'
        this.config.userName = 'sql3355462'
        this.config.databaseName = 'sql3355462'
        this.config.password = 'zU2DKRQXyK'
        this.config.poolConnectionLimit = 10
        this.config.waitForConnections = true
    })

    beforeEach(() => {
        this.wrapper = new mysqlWrapper(this.config)
        this.onRejected = (err) => {
            throw new Error(err)
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
                params: ['Soups', 'id', 1]
            }).then((res) => {
                assert.strictEqual(res.shift().name, 'Bruh')
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