let {
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql')

// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Soup',
    description: 'A soup',
    fields: {
        SoupId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        SoupName: {
            type: GraphQLString
        }
    }
})