const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class Meat extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'Meats'
    }

    /**
     * Overrides PRIMARY_KEY
     */
    static get PRIMARY_KEY() {
        return 'MeatId'
    }

    /**
     * Returns a Meat by its ID
     */
    static async getByID(_, { MeatId }) {
        return await this.find(MeatId)
    }

    /**
     * Returns a list of Meats matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, fields) {
        // Returns early with all Meats if no criteria was passed
        if(Object.keys(fields).length === 0) return this.findAll()

        // Find matching Meats
        return this.findByFields({
            fields
        })
    }

    /**
     * Creates a new Meat
     */
    static async createEntry(_, { MeatName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let _result = await this.insert(connection, {
                data: {
                    MeatName
                }
            })

            return this.getByID(_, { MeatId: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release();
        }
    }

    /**
     * Updates a Meat
     */
    static async updateEntry(_, { MeatId, MeatName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.update(connection, {
                id: MeatId,
                data : {
                    MeatName
                }
            })

            return this.getByID(_, { MeatId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }

    /**
     * Deletes the Meat
     */
    static async deleteEntry(_, { MeatId }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, {
                id: MeatId
            })

            return this.getByID(_, { MeatId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }
}

module.exports = Meat