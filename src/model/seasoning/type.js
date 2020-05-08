let {
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql')

// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Seasoning',
    description: 'A seasoning',
    fields: {
        SeasoningId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        SeasoningName: {
            type: GraphQLString
        }
    }
})