const mysql = require('mysql')

class mysqlConnector {
    constructor(config) {
        if(config) {
            this.initializeInternalPool(config)
        }
    }

    initializeInternalPool(config) {
        this.internalPool = mysql.createPool({
            host: config.hostAddress,
            user: config.userName,
            database: config.databaseName,
            password: config.password,
            connectionLimit: config.poolConnectionLimit,
            waitForConnections: config.waitForConnections
        })
    }

    registerThreadCounterEvent() {
        this.internalPool.on('connection', (connection) => console.log(`New connection stablished with server on thread #${connection.threadId}`))
    }

    get pool() {
        return this.internalPool
    }

    getPoolConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if(err) {
                    reject(err)
                }

                resolve(connection)
            })
        })
    }
}

module.exports = mysqlConnector