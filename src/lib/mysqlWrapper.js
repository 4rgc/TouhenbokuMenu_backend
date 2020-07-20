const mySQLConnector = require('./mysqlConnector')
const List = require('collections/list')

class mysqlWrapper {
    get connector() {
        return this.internalConnector
    }
    getTransationConnection(index) {
        return this.transactionConnections[index]
    }

    constructor(connectorConfig) {
        this.transactionConnections = new List()
        if(connectorConfig)
            this.internalConnector = new mySQLConnector(connectorConfig)
        else
            this.internalConnector = new mySQLConnector()
    }

    createQuery({query, params}) {

        return new Promise((succeed, fail) => {
            mySQLConnector.pool.getConnection((err, connection) => {

                //If an error was passed getting a connection, fails the promise sending it to the caller
                if (err) {
                    return fail(err)
                }

                //Runs the query
                connection.query(query, params, (err, rows) => {

                    //Releases the connection
                    connection.release()

                    //If an error was passed running the query, fails the promise sending it to the caller
                    if (err) {
                        return fail(err)
                    }

                    //Fulfills the promise
                    return succeed(rows)
                })
            })
        })
    }

    beginTransaction() {
        let index = this.transactionConnections.push(this.getConnectionFromPool())
        return new Promise((succeed, fail) => {

            transactionConnections[index].then(
            (connection) => {
                    connection.beginTransaction(err => {

                    //Fails the promise if the transaction cannot be opened
                    if (err) {
                        return fail(err)
                    }

                    //Fulfills the promise
                    return succeed(index)
                })
            },
            (err) => {
                fail(err)
            })
        })
    }

    ///TODO: refactor this to work with connectionIndices not connections
    createTransactionalQuery({query, params, connectionIndex}) {
        let connection = this.getTransationConnection(connectionIndex)

        return new Promise((succeed, fail) => {

            connection.query(query, params, (err, rows) => {
                
                //If an error was passed running the query, fails the promise sending it to the caller
                if (err) {
                    return fail(err)
                }
                
                //Fulfills the promise
                return succeed(rows)
            })
        })
    }

    commit(connectionIndex) {
        let connection = this.getTransationConnection(connectionIndex)

        return new Promise((succeed, fail) => {

            try {
                connection.commit(err => { 
                    if (err) { 
                        return rollback(connection, err)
                    }

                    return succeed()
                })
            } catch (e) {
                return fail(e)
            } finally {
                connection.release()
                this.transactionConnections.delete(connectionIndex)
            }

        })

    }

    rollback(connectionIndex) {
        let connection = this.getTransationConnection(connectionIndex)

        return new Promise((succeed, fail) => {

            try {
                connection.rollback(() => succeed())
            } catch (e) {
                return fail(e)
            } finally {
                connection.release()
                this.transactionConnections.delete(connectionIndex)
            }

        })
    }

    getConnectionFromPool() {
        return new Promise((succeed, fail) => {

            connector.pool.getConnection((err, connection) => {

                //Fails the promise if a connection cannot be retrieved
                if (err) {
                    return fail(err)
                }

                //Returns a conncetion
                return succeed(connection)
            })
        })
    }
}

module.exports = mysqlWrapper