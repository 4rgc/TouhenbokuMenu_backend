const PoolConnection = require('mysql/lib/PoolConnection')
const Connection = require('mysql/lib/Connection')
const { FakeError } = require('../error/error')

class FakePoolConnection extends PoolConnection{
    constructor(faulty = false) {
        super({}, {config: {}})
        this._faulty = faulty
    }

    get faulty() {
        return this._faulty
    }

    set faulty(value) {
        this._faulty = value
    }

    query(query, params, callback) {
        if(this._faulty)
            callback(new FakeError(), query)
        else
            callback(undefined, query)
    }

    release() {
        this.released = true
    }

    beginTransaction(options, callback) {
        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }
        if(this._faulty)
            callback(new FakeError())
        else
            callback()
    }
    
    commit(callback) {
        if(this._faulty)
            callback(new FakeError())
        else
            callback()
    }

    rollback(callback) {
        if(this._faulty)
            throw new FakeError()
        callback()
    }
}

module.exports = FakePoolConnection