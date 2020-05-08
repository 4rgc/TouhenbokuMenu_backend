const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class Topping extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'Toppings'
    }

    /**
     * Overrides PRIMARY_KEY
     */
    static get PRIMARY_KEY() {
        return 'ToppingId'
    }

    /**
     * Returns a Topping by its ID
     */
    static async getByID(_, { ToppingId }) {
        return await this.find(ToppingId)
    }

    /**
     * Returns a list of Toppings matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, fields) {
        // Returns early with all Toppings if no criteria was passed
        if(Object.keys(fields).length === 0) return this.findAll()

        // Find matching Toppings
        return this.findByFields({
            fields
        })
    }

    /**
     * Creates a new Topping
     */
    static async createEntry(_, { ToppingName, ToppingPrice, ToppingExtra }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let _result = await this.insert(connection, {
                data: {
                    ToppingName,
                    ToppingPrice,
                    ToppingExtra
                }
            })

            return this.getByID(_, { ToppingId: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release();
        }
    }

    /**
     * Updates a Topping
     */
    static async updateEntry(_, { ToppingId, ToppingName, ToppingPrice, ToppingExtra }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.update(connection, {
                id: ToppingId,
                data : {
                    ToppingName,
                    ToppingPrice,
                    ToppingExtra
                }
            })

            return this.getByID(_, { ToppingId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }

    /**
     * Deletes the Topping
     */
    static async deleteEntry(_, { ToppingId }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, {
                id: ToppingId
            })

            return this.getByID(_, { ToppingId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }
}

module.exports = Topping