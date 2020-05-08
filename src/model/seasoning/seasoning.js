const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class Seasoning extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'Seasonings'
    }

    /**
     * Overrides PRIMARY_KEY
     */
    static get PRIMARY_KEY() {
        return 'SeasoningId'
    }

    /**
     * Returns a Seasoning by its ID
     */
    static async getByID(_, { SeasoningId }) {
        return await this.find(SeasoningId)
    }

    /**
     * Returns a list of Seasonings matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, fields) {
        // Returns early with all Seasonings if no criteria was passed
        if(Object.keys(fields).length === 0) return this.findAll()

        // Find matching Seasonings
        return this.findByFields({
            fields
        })
    }

    /**
     * Creates a new Seasoning
     */
    static async createEntry(_, { SeasoningName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let _result = await this.insert(connection, {
                data: {
                    SeasoningName
                }
            })

            return this.getByID(_, { SeasoningId: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release();
        }
    }

    /**
     * Updates a Seasoning
     */
    static async updateEntry(_, { SeasoningId, SeasoningName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.update(connection, {
                id: SeasoningId,
                data : {
                    SeasoningName
                }
            })

            return this.getByID(_, { SeasoningId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }

    /**
     * Deletes the Seasoning
     */
    static async deleteEntry(_, { SeasoningId }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, {
                id: SeasoningId
            })

            return this.getByID(_, { SeasoningId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }
}

module.exports = Seasoning