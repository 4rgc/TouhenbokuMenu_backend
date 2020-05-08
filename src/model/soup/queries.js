const { 
        GraphQLList,
        GraphQLString,
        GraphQLID 
} = require('graphql')
const type = require('./type')
const Soup = require("./soup")

// Defines the queries
module.exports = 
{
    Soups: {
        type: new GraphQLList(type),
        args: {
            SoupName: { type: GraphQLString }
        },
        resolve: Soup.findMatching.bind(Soup)
    },
    Soup: {
        type,
        args: {
            SoupId: { type: GraphQLID }
        },
        resolve: Soup.getByID.bind(Soup)
    }
}