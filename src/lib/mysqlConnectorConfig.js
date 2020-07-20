const PoolConfig = require('mysql/lib/PoolConfig')

class mysqlConnectorConfig {
    innerObject 
    constructor() {
        this.innerObject = new PoolConfig({})
    }
    get hostAddress() {
        return this.innerObject.host
    }
    set hostAddress(address) {
        this.innerObject.host = address
    }
    get userName() {
        return this.innerObject.user
    }
    set userName(name) {
        this.innerObject.user = name
    }
    get databaseName() {
        return this.innerObject.database
    }
    set databaseName(name) {
        this.innerObject.database = name
    }
    get password() {
        return this.innerObject.password
    }
    set password(password) {
        this.innerObject.password = password
    }
    get poolConnectionLimit() {
        return this.innerObject.connectionLimit
    }
    set poolConnectionLimit(numberOfConnections) {
        this.innerObject.connectionLimit = numberOfConnections
    }
    get waitForConnections() {
        return this.innerObject.waitForConnections
    }
    set waitForConnections(value) {
        this.innerObject.waitForConnections = value
    }
}

function getEnvironmentConfig() {
    let config = new mysqlConnectorConfig()
    config.userName = process.env.MYSQL_DB_USER || config.userName
    config.databaseName = process.env.MYSQL_DB_NAME || config.databaseName
    config.password = process.env.MYSQL_DB_PASSWORD || config.password
    config.hostAddress = process.env.MYSQL_DB_ADDRESS || config.hostAddress
    config.poolConnectionLimit = process.env.MYSQL_DB_POOL_SIZE || config.poolConnectionLimit
    return config
}

module.exports.mysqlConnectorConfig = mysqlConnectorConfig
Object.defineProperty(module.exports, 'environmentConfig', {
    get() {
        return getEnvironmentConfig()
    }
})