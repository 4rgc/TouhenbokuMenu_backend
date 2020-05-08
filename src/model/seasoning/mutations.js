const { 
    GraphQLString,
    GraphQLID,
} = require('graphql')
const type = require('./type')
const Seasoning = require('./seasoning')

// Defines the mutations
module.exports = 
{
    addSeasoning: {
        type,
        args: {
            SeasoningName:   { type: GraphQLString }
        },
        resolve: Seasoning.createEntry.bind(Seasoning)
    },
    updateSeasoning: {
        type,
        args: {
            SeasoningId:     { type: GraphQLID },
            SeasoningName:   { type: GraphQLString }
        },
        resolve: Seasoning.updateEntry.bind(Seasoning)
    },
    deleteSeasoning: {
        type,
        args: {
            SeasoningId:     { type: GraphQLID }
        },
        resolve: Seasoning.deleteEntry.bind(Seasoning)
    }
}
