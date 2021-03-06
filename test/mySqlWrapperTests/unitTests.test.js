const { mysqlWrapper } = require('../../src/lib/mysqlWrapper')
const fakePoolConnection = require('../../src/lib/fakePoolConnection')
const fakePool = require('../../src/lib/fakePool')
const assert = require('assert')
const { FakeError, NoSuchTransactionError } = require('../../src/error/error')

describe('mysqlWrapper Unit', () => {
    beforeEach(() => {
        this.onRejected = (err) => {
            throw new Error('rejected: \n' + err.message + '\n' + err.stack)
        }
        this.wrapper = new mysqlWrapper()
    })
    
    describe('#createQuery()', () => {
        it('should return "test"', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.createQuery({
                query: 'test', 
                params: []
            }).then((res) => {
                assert.strictEqual(res.shift(), 'test')
                done()
            },
            this.onRejected
            )
        })
        it('should return "bruh"', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.createQuery({
                query: 'bruh', 
                params: []
            }).then((res) => {
                assert.strictEqual(res.shift(), 'bruh')
                done()
            },
            this.onRejected
            )
        })
        it('should release the connection', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()

            this.wrapper.internalConnector.internalPool.on('release', 
            (connection) => {
                done()
            })
            this.wrapper.createQuery({
                query: 'test',
                params: []
            }).catch(this.onRejected)
            
        })

        it('should fake reject', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool(true)
            this.wrapper.createQuery({query: 'bruh', params: ''}).then((res) => {
                throw new Error('resolved')
            }, 
            (err) => {
                if(!(err instanceof FakeError)) {
                    throw err
                }
                done()
            })
        })
    })

    describe('#getTransactionConnection()', () => {
        it('should return a FakePoolConnection', () => {
            this.wrapper.transactionConnections.push(new fakePoolConnection())
            assert.strictEqual(
                this.wrapper.getTransationConnection(0).constructor.name, 
                fakePoolConnection.name
                )
        })
        it('should throw NoSuchTransactionError()', () => {
            let error
            try {
                this.wrapper.getTransationConnection(0)
            }
            catch(err) {
                error = err
            }
            finally {
                assert.strictEqual(error.constructor.name, NoSuchTransactionError.name)
            }
        })
    })

    describe('#beginTransaction()', () => {
        it('should return 0', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.beginTransaction().then((index) => {
                assert.strictEqual(index, 0)
                done()
            },
            this.onRejected
            )
        })
        it('should return 10', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.transactionConnections = [0,1,2,3,4,5,6,7,8,9]
            this.wrapper.beginTransaction().then((index) => {
                assert.strictEqual(index, 10)
                done()
            }),
            this.onRejected
        })
        it('should fake reject', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool(true)
            this.wrapper.beginTransaction().then((index) => {
                throw new Error('resolved')
            },
            (err) => {
                if(!(err instanceof FakeError)) {
                    throw err
                }
                done()
            })
        })
    })

    describe('#createTransactionalQuery()', () => {
        it('should return "test"', (done) => {
            this.wrapper.transactionConnections[0] = new fakePoolConnection()
            this.wrapper.createTransactionalQuery({
                query: 'test',
                params: [],
                transactionId: 0
            }).then((res) => {
                assert.strictEqual(res.shift(), 'test')
                done()
            }).catch(this.onRejected)
        })
        it('should leave the connection unreleased', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.transactionConnections[0] = new fakePoolConnection(this.wrapper.connector.pool)
            this.wrapper.internalConnector.internalPool.on('release', () => {
                throw new Error('connection released')
            })
            this.wrapper.createTransactionalQuery({
                query: 'test',
                params: [],
                transactionId: 0
            }).then((res) => {
                done()
            }).catch(this.onRejected)
        })
    })

    describe('#getConnectionFromPool()', () => {
        it('should return a connection', (done) => {
            this.wrapper.connector.internalPool = new fakePool()
            this.wrapper.getConnectionFromPool().then(connection => {
                assert.strictEqual(connection.constructor.name, fakePoolConnection.name)
                done()
            }).catch(this.onRejected)
        })
        it('should fake reject', (done) => {
            this.wrapper.connector.internalPool = new fakePool(true)
            this.wrapper.getConnectionFromPool().then(connection => {
                throw new Error('resolved')
            }).catch(err => {
                if(!(err instanceof FakeError))
                    throw err
                done()
            })
        })
    })

    describe('#commit()', () => {
        it('should commit and remove the connection', (done) => {
            this.wrapper.transactionConnections.push(new fakePoolConnection(new fakePool()))
            this.wrapper.commit(0).then(() => {
                assert.strictEqual(this.wrapper.transactionConnections[0], undefined)
                done()
            },
            this.onRejected)
        })
        it('should commit and remove the connection', (done) => {
            this.wrapper.transactionConnections = [new fakePoolConnection(new fakePool()), new fakePoolConnection(new fakePool())]
            this.wrapper.commit(0).then(() => {
                assert.strictEqual(this.wrapper.transactionConnections[0], undefined)
                done()
            },
            this.onRejected)
        })
        it('should release the connection', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.transactionConnections.push(
                new fakePoolConnection(this.wrapper.internalConnector.internalPool)
                )
            this.wrapper.internalConnector.internalPool.on('release', (connection) => {
                done()
            })
            this.wrapper.commit(0).then(() => {
            },
            this.onRejected)
        })
        it('should release the connection', (done) => {
            this.wrapper.internalConnector.internalPool = new fakePool()
            this.wrapper.transactionConnections.push(
                new fakePoolConnection(this.wrapper.internalConnector.internalPool, true)
                )
            this.wrapper.internalConnector.internalPool.on('release', (connection) => {
                done()
            })
            this.wrapper.commit(0).catch(
            (err) => {
                if(!(err instanceof FakeError))
                    throw err
            })
        })
        it('should fake reject', (done) => {
            this.wrapper.transactionConnections.push(new fakePoolConnection(new fakePool(),true))
            this.wrapper.commit(0).then(() => {
                throw new Error('resolved')
            }).catch(
            (err) => {
                assert.strictEqual(this.wrapper.transactionConnections[0], undefined)
                if(!(err instanceof FakeError))
                    throw err
                done()
            })
        })
    })

    describe('#rollback()', () => {
        it('should rollback and commit the connection', (done) => {
            this.wrapper.transactionConnections.push(new fakePoolConnection(new fakePool()))
            this.wrapper.rollback(0).then(() => {
                assert.strictEqual(this.wrapper.transactionConnections[0], undefined)
                done()
            },
            this.onRejected)
        })
        it('should rollback and commit the connection', (done) => {
            this.wrapper.transactionConnections = [new fakePoolConnection(new fakePool()), new fakePoolConnection(new fakePool()), new fakePoolConnection(new fakePool())]
            this.wrapper.rollback(1).then(() => {
                assert.strictEqual(this.wrapper.transactionConnections[1], undefined)
                done()
            },
            this.onRejected)
        })
        it('should fake reject', (done) => {
            this.wrapper.transactionConnections.push(new fakePoolConnection(new fakePool(), true))
            this.wrapper.rollback(0).then(() => {
                throw new Error('resolved')
            },
            (err) => {
                if(!(err instanceof FakeError))
                    throw err
                assert.strictEqual(this.wrapper.transactionConnections[0], undefined)
                done()
            })
        })
    })
})