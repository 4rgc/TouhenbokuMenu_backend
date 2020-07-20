const Pool = require('mysql/lib/Pool')
const fakePoolConnection = require('./fakePoolConnection')

class FakePool extends Pool {
    constructor() {
        super(
            {
                config: {
                    /*host: '',
                    user: '',
                    database: '',
                    password: '',
                    connectionLimit: 10,
                    waitForConnections: true,*/
                    connectionConfig: {}
                }
            })
    }
    getConnection(callback) {
        callback(null, new fakePoolConnection())
    }
}

module.exports = FakePool