let {
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql')

// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Meat',
    description: 'A meat',
    fields: {
        MeatId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        MeatName: {
            type: GraphQLString
        }
    }
})