const mySQLConnector = require('./mysqlConnector')
const mysqlConnectorConfig = require('./mysqlConnectorConfig')
const { NoSuchTransactionError } = require('../error/error')

class MysqlWrapper {
    constructor(connectorConfig) {
        this.transactionConnections = []
        if(connectorConfig)
            this.internalConnector = new mySQLConnector(connectorConfig)
        else
            this.internalConnector = new mySQLConnector()
    }

    createQuery({query, params}) {
        return new Promise((succeed, fail) => {
            this.getConnectionFromPool().then((connection) => {
                connection.query(query, params, (err, rows) => {
                    connection.release()

                    if (err) 
                        return fail(err)

                    return succeed(rows)
                })
            }).catch(err => {
                fail(err)
            })
        })
    }

    get connector() {
        return this.internalConnector
    }

    getTransationConnection(id) {
        let connection = this.transactionConnections[id]
        if(connection)
            return connection
        else {
            throw new NoSuchTransactionError(id)
        }
    }

    beginTransaction() {
        return new Promise((succeed, fail) => {
            this.getConnectionFromPool().then((connection) => {
                let id = this.addTransactionConnection(connection)
                connection.beginTransaction((err) => {
                    if(err) {
                        return fail(err)
                    }

                    return succeed(id)
                })
            },
            (err) => {
                return fail(err)
            })
        })
    }

    addTransactionConnection(connection) {
        let newId = this.transactionConnections.length
        this.transactionConnections[newId] = connection
        return newId
    }

    createTransactionalQuery({query, params, transactionId}) {
        let connection = this.getTransationConnection(transactionId)

        return new Promise((succeed, fail) => {

            connection.query(query, params, (err, rows) => {
                
               if (err) {
                    return fail(err)
                }
                
                return succeed(rows)
            })
        })
    }

    getConnectionFromPool() {
        return new Promise((succeed, fail) => {

            this.connector.pool.getConnection((err, connection) => {

                if (err) {
                    return fail(err)
                }
                return succeed(connection)
            })
        })
    }

    commit(transactionId) {
        return new Promise((succeed, fail) => {
            let connection = this.getTransationConnection(transactionId)
            try {
                connection.commit(err => { 
                    if (err) {
                        return this.rollback(transactionId).then(() => {
                            fail(err);
                        })
                        .catch(e => {
                            fail(e)
                        })
                    }
                    return succeed()
                })
            } catch (e) {
                return fail(e)
            } finally {
                connection.release()
                this.removeTransactionConnection(transactionId)
            }

        })

    }

    rollback(transactionId) {
        return new Promise((succeed, fail) => {
            let connection = this.getTransationConnection(transactionId)
            try {
                connection.rollback(() => succeed())
            } catch (e) {
                return fail(e)
            } finally {
                connection.release()
                this.removeTransactionConnection(transactionId)
            }

        })
    }

    removeTransactionConnection(id) {
        this.transactionConnections[id] = undefined
    }
}

module.exports.mysqlWrapper = MysqlWrapper
module.exports.mysqlWrapperInstance = new MysqlWrapper(mysqlConnectorConfig.environmentConfig)