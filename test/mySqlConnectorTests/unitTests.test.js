const assert = require('assert')
const mysqlConnector = require('../../src/lib/mysqlConnector')
const {mysqlConnectorConfig, environmentConfig} = require('../../src/lib/mysqlConnectorConfig')
const fakePool = require('../../src/lib/fakePool')
const mysql = require('mysql')
const PoolConnection = require('mysql/lib/PoolConnection')

describe('mysqlConnector', () => {
    before(() => {
        this.realConfig = new mysqlConnectorConfig()
        this.realConfig.hostAddress = 'andriibohdan.coxounsjxrqz.us-east-2.rds.amazonaws.com'
        this.realConfig.userName = 'apiuser'
        this.realConfig.databaseName = 'touhenboku_menu_db'
        this.realConfig.password = '7g6N?R5t'
        this.realConfig.poolConnectionLimit = 10
        this.realConfig.waitForConnections = true

        this.fakeConfig = new mysqlConnectorConfig()
        this.fakeConfig.hostAddress = 'sql3.freemysqlhosting.net'
        this.fakeConfig.userName = 'sql3355462'
        this.fakeConfig.databaseName = 'sql3355462'
        this.fakeConfig.password = 'zU2DKRQXyK'
        this.fakeConfig.poolConnectionLimit = 10
        this.fakeConfig.waitForConnections = true
    })
    describe('#initializeInternalPool()', () => {
        it('should set internalPool to new Pool', () => {
            let connector = new mysqlConnector()

            connector.initializeInternalPool(this.fakeConfig)

            assert.deepStrictEqual(connector.pool, mysql.createPool({
                host: 'sql3.freemysqlhosting.net',
                user: 'sql3355462',
                database: 'sql3355462',
                password: 'zU2DKRQXyK',
                connectionLimit: 10,
                waitForConnections: true 
            }))
        })
    })
    describe('#getPoolConnection()', () => {
        it('should return a connection instance', () => {
            let connector = new mysqlConnector()
            connector.internalPool = new fakePool()
            connector.getPoolConnection().then((connection) => {
                assert.strictEqual(connection instanceof PoolConnection, true)
            })
        })
        it('should reject', () => {
            let connector = new mysqlConnector()
            connector.getPoolConnection().then(
                () => { throw new Error('resolved despite having no pool') }, 
                (error) => {}
            )
        })
    })
})