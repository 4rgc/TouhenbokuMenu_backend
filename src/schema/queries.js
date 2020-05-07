const { GraphQLObjectType } = require('graphql')
const soupQueries = require('../model/soup/queries')
const noodleQueries = require('../model/noodle/queries')

module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Soup: soupQueries.Soup,
        Soups: soupQueries.Soups,
        Noodle: noodleQueries.Noodle,
        Noodles: noodleQueries.Noodles
    }
})