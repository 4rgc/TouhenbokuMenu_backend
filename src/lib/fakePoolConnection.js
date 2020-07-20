const PoolConnection = require('mysql/lib/PoolConnection')

class FakePoolConnection extends PoolConnection{
    constructor() {
        super({}, {config: {}})
    }

    query(query, params, callback) {
        callback(undefined, query)
    }

    release() {
        this.released = true
    }
}

module.exports = FakePoolConnection