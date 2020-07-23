const Pool = require('mysql/lib/Pool')
const fakePoolConnection = require('./fakePoolConnection')
const { FakeError } = require('../error/error')

class FakePool extends Pool {
    constructor(faulty = false) {
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
        this._faulty = faulty
    }
    
    get faulty() {
        return this._faulty
    }

    set faulty(value) {
        this._faulty = value
    }

    getConnection(callback) {
        if(!this._faulty) 
            callback(null, new fakePoolConnection(this._faulty))
        else
            callback(new FakeError())
    }
}

module.exports = FakePool