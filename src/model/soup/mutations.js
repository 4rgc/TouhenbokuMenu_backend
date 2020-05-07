const { 
    GraphQLString,
    GraphQLID,
} = require('graphql')
const type = require('./type')
const Soup = require('./soup')

// Defines the mutations
module.exports = {
    addSoup: {
        type,
        args: {
            SoupName:   { type: GraphQLString }
        },
        resolve: Soup.createEntry.bind(Soup)
    },
    updateSoup: {
        type,
        args: {
            SoupId:     { type: GraphQLID },
            SoupName:   { type: GraphQLString }
        },
        resolve: Soup.updateEntry.bind(Soup)
    },
    deleteSoup: {
        type,
        args: {
            SoupId:     { type: GraphQLID }
        },
        resolve: Soup.deleteEntry.bind(Soup)
    }
}
