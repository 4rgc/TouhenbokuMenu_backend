class NoSuchTransactionError extends Error {
    constructor(transactionIndex) {
        super("Transaction with such index doesn't exist: " + transactionIndex)
    }
}

class FakeError extends Error {
    constructor() {
        super('Fake error')
    }
} 

exports.NoSuchTransactionError = NoSuchTransactionError
exports.FakeError = FakeError