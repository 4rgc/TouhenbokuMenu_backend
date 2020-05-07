const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class Noodle extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'Noodles'
    }

    /**
     * Overrides PRIMARY_KEY
     */
    static get PRIMARY_KEY() {
        return 'NoodleId'
    }

    /**
     * Returns a Noodle by its ID
     */
    static async getByID(_, { NoodleId }) {
        return await this.find(NoodleId)
    }

    /**
     * Returns a list of Noodles matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, fields) {
        // Returns early with all Noodles if no criteria was passed
        if(Object.keys(fields).length === 0) return this.findAll()

        // Find matching Noodles
        return this.findByFields({
            fields
        })
    }

    /**
     * Creates a new Noodle
     */
    static async createEntry(_, { NoodleName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let _result = await this.insert(connection, {
                data: {
                    NoodleName
                }
            })

            return this.getByID(_, { NoodleId: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release();
        }
    }

    /**
     * Updates a Noodle
     */
    static async updateEntry(_, { NoodleId, NoodleName }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.update(connection, {
                id: NoodleId,
                data : {
                    NoodleName
                }
            })

            return this.getByID(_, { NoodleId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }

    /**
     * Deletes the Noodle
     */
    static async deleteEntry(_, { NoodleId }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, {
                id: NoodleId
            })

            return this.getByID(_, { NoodleId })
        } finally {
            // Releases the connection
            if(connection != null) connection.release()
        }
    }
}

module.exports = Noodle