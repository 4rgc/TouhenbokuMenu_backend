const { 
    GraphQLList,
    GraphQLID,
    GraphQLString 
} = require('graphql')
const type = require('./type')
const Seasoning = require('./seasoning')

// Defines the queries
module.exports = 
{
    Seasonings: {
        type: new GraphQLList(type),
        args: {
            SeasoningName:      { type: GraphQLString }
        },
        resolve: Seasoning.findMatching.bind(Seasoning)
    },
    Seasoning: {
        type,
        args: {
            SeasoningId:        { type: GraphQLID }
        },
        resolve: Seasoning.getByID.bind(Seasoning)
    }
}