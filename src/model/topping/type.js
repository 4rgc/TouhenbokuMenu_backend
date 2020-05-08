let {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql')

// Defines the type
module.exports = new GraphQLObjectType({
    name: 'Topping',
    description: 'A topping',
    fields: {
        ToppingId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        ToppingName: {
            type: GraphQLString
        },
        ToppingPrice: {
            type: GraphQLInt
        },
        ToppingExtra: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    }
})