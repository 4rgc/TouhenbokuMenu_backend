const PoolConnection = require('mysql/lib/PoolConnection')

class FakePoolConnection extends PoolConnection{
    constructor() {
        super({}, {config: {}})
    }
}

module.exports = FakePoolConnection