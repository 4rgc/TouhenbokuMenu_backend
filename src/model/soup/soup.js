const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class Soup extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'Soups'
    }

    /**
     * Overrides PRIMARY_KEY 
     */
    static get PRIMARY_KEY() {
        return 'SoupId'
    }

    /**
     * Returns a Soup by its ID
     */
    static async getByID(_, { SoupId }) {
        return await this.find(SoupId)
    }

    /**
     * Returns a list of Soups matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, fields) {
        // Returns early with all Soups if no criteria was passed
        if (Object.keys(fields).length === 0) return this.findAll()
        
        // Find matching Soups
        return this.findByFields({
            fields
        })
    }

    /**
     * Creates a new Soup
     */
    static async createEntry(_, { SoupName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let _result = await this.insert(connection, {
                data: {
                    SoupName
                }
            })

            return this.getByID(_, { SoupId: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    /**
     * Updates a Soup 
     */
    static async updateEntry(_, { SoupId, SoupName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {

            await this.update(connection, {
                id: SoupId,
                data: {
                    SoupName
                }
            })

            return this.getByID(_, { SoupId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    /**
     * Deletes the Soup
     */
    static async deleteEntry(_, { SoupId }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, {
                id: SoupId
            })

            return this.getByID(_, { SoupId }) 
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }
}

module.exports = Soup